import mongoose from "mongoose";

const insightSchema = new mongoose.Schema({
  end_year: { type: String, default: "" },
  intensity: { type: Number },
  sector: { type: String },
  topic: { type: String },
  insight: { type: String },
  url: { type: String },
  region: { type: String },
  start_year: { type: String, default: "" },
  impact: { type: String, default: "" },
  added: { type: String },      // or Date if you want to parse it
  published: { type: String },  // or Date
  country: { type: String },
  relevance: { type: Number },
  pestle: { type: String },
  source: { type: String },
  title: { type: String },
  likelihood: { type: Number }
}, {
  timestamps: true // adds createdAt and updatedAt
});

const Insight = mongoose.model("Insight", insightSchema);

export default Insight;
