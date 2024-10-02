import mongoose from 'mongoose';

const activateAccountTokenSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: Date.now() + 10 * 60 * 1000,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

activateAccountTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 10 * 60 });

const ActivateAccountToken = mongoose.model('activateAccountToken', activateAccountTokenSchema);

export default ActivateAccountToken;
