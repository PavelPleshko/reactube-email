import mongoose from 'mongoose';

const EMAIL_TYPES = ['confirm_user'];

const EmailSchema = new mongoose.Schema({
  from: {
    type: String,
    trim: true,
    required: 'From email is required'
  }, 
  to: {
    type: String,
    trim: true,
    required: 'To email is required'
  },
  type: {
    type: String,
    enum:EMAIL_TYPES,
    required:'Type is required'
  },
  subject:{
  	type:String,
  	required:true
  },
  text:{
  	type:String,
  	required:true
  },
  date: {
    type: Date,
    default: Date.now
  }
})


export default mongoose.model('Email', EmailSchema);