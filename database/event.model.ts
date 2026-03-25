import mongoose from "mongoose";

export interface EventAttrs {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
}

export interface EventDocument extends mongoose.Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new mongoose.Schema<EventDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: { type: [String], required: true, default: [] },
    organizer: { type: String, required: true, trim: true },
    tags: { type: [String], required: true, default: [] },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Generates and validates slug/date/time before save.
type PreSaveFunction = (this: EventDocument, next: (err?: Error | null) => void) => void;

const preSave: PreSaveFunction = function(this: EventDocument, next: (err?: Error | null) => void): void {
  // Ensure required string fields are non-empty.
  const requiredFields: Array<keyof EventAttrs> = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "mode",
    "audience",
    "organizer",
  ];

  for (const field of requiredFields) {
    const value = this[field];
    if (typeof value !== "string" || !value.trim()) {
      return next(new Error(`Event ${field} is required and cannot be empty`));
    }
  }

  // Auto-generate slug only when title changes.
  if (this.isModified("title")) {
    const normalizedTitle = this.title.trim().toLowerCase();
    this.slug = normalizedTitle
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Normalize date to ISO (YYYY-MM-DD) and validate.
  const parsedDate = new Date(this.date);
  if (Number.isNaN(parsedDate.getTime())) {
    return next(new Error("Event date must be a valid date"));
  }
  this.date = parsedDate.toISOString().split("T")[0];

  // Normalize time to HH:mm in 24-hour format.
  const timeRaw = this.time.trim();
  const timeMatch = timeRaw.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!timeMatch) {
    return next(new Error("Event time must be formatted as HH:mm or HH:mm AM/PM"));
  }

  let hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  const ampm = timeMatch[3]?.toUpperCase();

  if (ampm) {
    if (ampm === "PM" && hour < 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return next(new Error("Event time values are invalid"));
  }

  this.time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

  next();
};

eventSchema.pre("save", preSave);

// Unique index for slug supports fast lookup and uniqueness.
eventSchema.index({ slug: 1 }, { unique: true });

export const Event =
  (mongoose.models.Event as mongoose.Model<EventDocument>) ||
  mongoose.model<EventDocument>("Event", eventSchema);
