import mongoose from 'mongoose'
import paginate from 'mongoose-paginate-v2' //สำหรับแบ่งเพจ

mongoose
  .connect(process.env.MONGODB_URL)
  .then((result) => console.log('Connection OK'))
  .catch((err) => console.log(err))

let productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  detail: String,
  date_added: Date,
})

productSchema.plugin(paginate) //สำหรับแบ่งเพจ

export let Product = mongoose.model('Product', productSchema)
