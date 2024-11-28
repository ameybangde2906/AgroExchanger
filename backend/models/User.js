import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    dob: {
      type: Date,
    },
    profileImg: {
      type: String,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number'],
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      lineOne: {
        type: String,
        default: "",
      },
      lineTwo: {
        type: String,
        default: "",
      },
      district: {
        type: String,
        default: "",
      },
      subDistrict: {
        type: String,
        default: "",
      },
      village: {
        type: String,
        default: "",
      },
      state: {
        type: String,
        default: "",
      },
      country: {
        type: String,
        default: "India",
      },
      postalCode: {
        type: String,
        default: "",
      },
    },
    userType: {
      type: String,
      enum: ['', 'individual', 'trader', 'institutional'],
      default: '',
    },
    aadhar: {
      number: { type: String, default: "" },
      verified: { type: Boolean, default: false },
    },
    pan: {
      number: { type: String, default: "" },
      verified: { type: Boolean, default: false },
    },
    gstNumber: {
      type: String,
      default: "",
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    currentLocation: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
      address:{
        type: String
      }
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;

