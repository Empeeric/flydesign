var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Types = Schema.Types,
    _ = require('lodash-contrib');

var schema = new Schema({
    navigation: { type: Types.ObjectId, ref: 'navigation' },
    name: { type: String },
    description: { type: String },
    picture: {type: Types.Filepicker, widget: 'FilepickerPictureWidget'},
//    slides: [{type: Types.Filepicker, widget: 'FilepickerPictureWidget'}],
    slides: [{
        picture: {type: Types.Filepicker, widget: 'FilepickerPictureWidget'},
        screen: Boolean
    }],
    title: { type: String },
    text: { type: Types.Html },
    order: { type: Number, editable: false },
    show: { type: Boolean, 'default': true }
});

schema.methods.toString = function(){
    return this.title;
};

schema.statics.byNavigationId = function(){
    var projects = this;
    return function(res, cb){
        var page = res.locals.page;

        projects
            .find()
            .where('navigation', page._id)
            .where('show', 1)
            .sort({'order': 1})
            .lean()
            .exec(function(err, results){
                if(results.length) res.locals.page.projects = {items :results};
                cb(err);
            });
    }
};

schema.formage = {
    list: ['navigation', 'name', 'description', 'picture', 'show'],
    list_populate: ['navigation'],
    order_by: ['order'],
    sortable: 'order'
};

module.exports = schema;
