import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  movieId: { 
    type: String, 
    required: true,  // ✅ Film ID'si zorunlu olsun
    trim: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true  // ✅ Yorumun sahibini garanti altına al
  },
  text: { 
    type: String, 
    required: true,  // ✅ Boş yorumları engelle
    trim: true 
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true  // ✅ Derecelendirme zorunlu olsun
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model('Comment', commentSchema);
