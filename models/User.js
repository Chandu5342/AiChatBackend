import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

class User extends Model {
  // method to check password
  checkPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    credits: { type: DataTypes.INTEGER, defaultValue: 10 }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: false, // ✅ Sequelize won’t look for updatedAt
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
);


User.deductCredits = async function(user_id, amount = 1) {
  const user = await User.findByPk(user_id);
  if (!user) throw new Error('User not found');
  if (user.credits < amount) throw new Error('Insufficient credits');
  user.credits -= amount;
  await user.save();
  return user.credits;
};

export default User;
