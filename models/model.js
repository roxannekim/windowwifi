var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var averageColorSchema = new Schema({
	city: String,
	red: Number,
	green: Number,
	blue: Number,
	localtime: String,
	dateAdded : { type: Date, default: Date.now },
})

// export 'AverageColor' model so we can interact with it in other files
module.exports = mongoose.model('AverageColor',averageColorSchema);