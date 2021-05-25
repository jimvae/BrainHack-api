import Clarifai from 'clarifai';

const app = new Clarifai.App({
    apiKey: "3d89fc08bddf4b4aa89fb9819ac11a1a",
   });

const handleAPICall = (req, res) => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        // Clarifai.COLOR_MODEL, imageURL
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json("unable to work with API"))
 }   

 const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}


export { handleAPICall, handleImage}