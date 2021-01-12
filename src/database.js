import mongoose from 'mongoose'
// mongo "mongodb+srv://cluster0.y1eqw.mongodb.net/project-summit" --username Eric
// mongoose.connect("mongodb://localhost/project-summit",{
mongoose.connect("mongodb+srv://Eric:Linkinlp0oi@cluster0.y1eqw.mongodb.net/project-summit?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(db => console.log('Db is connected'))
    .catch(error => console.log(error))

