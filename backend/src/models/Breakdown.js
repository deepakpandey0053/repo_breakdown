import mongoose from 'mongoose';

const breakdownSchema = new mongoose.Schema(
  {
    repoUrl: {
      type: String,
      required: true,
      index: true,
    },
    owner: {
      type: String,
      required: true,
    },
    repo: {
      type: String,
      required: true,
    },
    commitSha: {
      type: String,
      default: '',
    },
    tree: {
      type: Array,
      default: [],
    },
    breakdownData: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

breakdownSchema.index({ owner: 1, repo: 1, commitSha: 1 });

const Breakdown = mongoose.model('Breakdown', breakdownSchema);
export default Breakdown;
