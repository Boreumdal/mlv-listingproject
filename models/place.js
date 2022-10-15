const mongoose = require('mongoose')

const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    lat: {
        type: String,
        default: '14.600279377838998'
    },
    lng: {
        type: String,
        default: '121.01467314680963'
    },
    uploaderFirst: {
        type: String,
        required: true
    },
    uploaderLast: {
        type: String,
        required: true
    },
    uploaderId: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    imageOne: {
        type: String,
        default: 'https://img.freepik.com/free-vector/internet-network-warning-404-error-page-file-found-web-page-internet-error-page-issue-found-network-404-error-present-by-man-sleep-display_1150-55450.jpg?w=2000'
    },
    imageTwo: {
        type: String,
        default: 'https://img.freepik.com/free-vector/internet-network-warning-404-error-page-file-found-web-page-internet-error-page-issue-found-network-404-error-present-by-man-sleep-display_1150-55450.jpg?w=2000'
    },
    imageThree: {
        type: String,
        default: 'https://img.freepik.com/free-vector/internet-network-warning-404-error-page-file-found-web-page-internet-error-page-issue-found-network-404-error-present-by-man-sleep-display_1150-55450.jpg?w=2000'
    },
    imageFour: {
        type: String,
        default: 'https://img.freepik.com/free-vector/internet-network-warning-404-error-page-file-found-web-page-internet-error-page-issue-found-network-404-error-present-by-man-sleep-display_1150-55450.jpg?w=2000'
    },
    dateCreated : {
        type: String,
        required: true
    },
    review: {
        type: Array,
        default: []
    }
})

const Place = mongoose.model('Place', placeSchema)

module.exports = Place