const mongoose = require('mongoose')
const Place = require('./models/place')
const User = require('./models/user')

mongoose.connect('mongodb://localhost:27017/mlvndb')
    .then(() => console.log('Database connected'))
    .catch(err => console.log(err))

let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
let today = new Date()

const seedAccount = [
    {
        _id: '634aa9b6593b9b8e4e5a2fc2',
        firstname: 'Melvin',
        lastname: 'Arellano',
        gender: 'male',
        birthday: '2000-11-28',
        username: 'admin',
        email: 'vin@g.com',
        password: '$2b$10$BmpnH/MWJKVhIpT6PHMBk./ivGgvaCQ9hm0o1Gf/YwnHhIhxuOaly'
    },
    {
        _id: '634aabfb38c60a8ad27ca986',
        firstname: 'Kazuha',
        lastname: 'Nakamura',
        gender: 'female',
        birthday: '2003-08-09',
        username: 'zuha',
        email: 'zuha@g.c',
        password: '$2b$10$e1ymBA3CzoHyQlnS4huVAOhWOHYqGZrbOG0fLeKWke8OOMRffNjai'
    },
    {
        _id: '634aac8938c60a8ad27ca998',
        firstname: 'David',
        lastname: 'Smith',
        gender: 'male',
        birthday: '1995-01-18',
        username: 'dave',
        email: 'dave@google.com',
        password: '$2b$10$TbTVyX/WYV/yD5XU2W64ceEhhHcw4USsQ/l0pijfufTaKYQmP95lK'
    },
    {
        _id: '634aaed638c60a8ad27ca99b',
        firstname: 'Yuju',
        lastname: 'Cortez',
        gender: 'female',
        birthday: '1999-02-01',
        username: 'yuju',
        email: 'ju@y.c',
        password: '$2b$10$D/JKF0C7myzLeyGyc0bXgeHYvNxvpHff2AhClI5niTt1PkacXxIZm'
    }            
]

const seedPost = [
    {
        name: 'Beachfront House',
        description: 'Located just 21 km from Pico de Loro Cove, 4 Bedroom Beachfront House with Private Pool in Batangas offers accommodation in Nasugbu with access to a private beach area, barbecue facilities, as well as a shared kitchen. Set on the beachfront, this property has an outdoor swimming pool, a shared lounge and a garden.',
        lat: '14.084695',
        lng: '120.61975',
        uploaderFirst: 'Melvin',
        uploaderLast: 'Arellano',
        uploaderId: '634aa9b6593b9b8e4e5a2fc2',
        tag: 'home',
        imageOne: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/376596398.jpg?k=7aa000c9d1432cbebc7420875d27cb9952323db21fce32d8e78d54f52d06bb1a&o=&hp=1',
        imageTwo: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/376596411.jpg?k=eb83679be2e5bdb75ccf016637236998f9fa0ce8b80eb8b311e1c8d7d29b0a5a&o=&hp=1',
        imageThree: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/376596358.jpg?k=8a9bcfe2a9e2b007d45453caf3627fea266613b32908aaf5d9785bdca4fc8276&o=&hp=1',
        imageFour: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/376596340.jpg?k=4dcc295c5e8603907151fa00ab6510651026386eb665c603368a57b4e67ca1ea&o=&hp=1',
        dateCreated: `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`,
        review: [
            {
                id: `ObjectId("634aabfb38c60a8ad27ca986")`,
                fname: 'Kazuha',
                lname: 'Nakamura',
                review: 'Great place!',
                dateCreated: 'October 15, 2022 08:48 PM'
            },
            {
                id: `ObjectId("634aaed638c60a8ad27ca99b")`,
                fname: 'Yuju',
                lname: 'Cortez',
                review: 'This place is fabulous if you like nature and chilling in paradise. Amazing staff, great location, nice finishing touches.',
                dateCreated: 'October 15, 2022 09:01 PM'
            },
            {
                id: `ObjectId("634aac8938c60a8ad27ca998")`,
                fname: 'David',
                lname: 'Smith',
                review: 'A whole lotta awesomeness all round if you want to get off the grid!',
                dateCreated: 'October 15, 2022 09:03 PM'
            }
        ]
    },
    {
        name: 'Villa Marinelli',
        description: 'Boasting views of the scenic Taal Volcano and Lake, the Italian-inspired Villa Marinelli Hometelle features an outdoor swimming pool. Cosy and air-conditioned rooms come with free WiFi. A 24-hour reception is available.',
        lat: '14.117921',
        lng: '120.965203',
        uploaderFirst: 'Kazuha',
        uploaderLast: 'Nakamura',
        uploaderId: '634aabfb38c60a8ad27ca986',
        tag: 'home',
        imageOne: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/173218397.jpg?k=95dd771de22a23952c10d47ab03fc792c7223cead7f4ca8e1e85c6f1d9e1d14f&o=&hp=1',
        imageTwo: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/173218432.jpg?k=293a3aa178b91863eba544a6b72154a06cbc0b9a324aba6594cb428706ca4b6c&o=&hp=1',
        imageThree: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/173221921.jpg?k=45e8eca0ceddbf0c2e3fffde89843879892c83b2bd3de52572bc063dfaa9717c&o=&hp=1',
        imageFour: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/173218304.jpg?k=dd0b057644b1e345e28490f86607bc73daa03ca2ad43b1a9e4f1486e3c56d7f7&o=&hp=1',
        dateCreated: `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`,
        review: [
            {
                id: `ObjectId("634aa9b6593b9b8e4e5a2fc2")`,
                fname: 'Melvin',
                lname: 'Arellano',
                review: 'Amazing view of Taal Lake and very accommodating staff',
                dateCreated: 'October 15, 2022 08:48 PM'
            },
            {
                id: `ObjectId("634aac8938c60a8ad27ca998")`,
                fname: 'David',
                lname: 'Smith',
                review: 'I liked the Florence room. It was spacious and clean. It also provided the quiet I needed to write.',
                dateCreated: 'October 15, 2022 09:01 PM'
            }
        ]
    },
    {
        name: 'Bliss',
        description: 'Situated in Manila, less than 1 km from Mall of Asia Arena, Bliss by John at Sea Residences features a living room with a flat-screen TV. Guests staying at this apartment have access to free WiFi, a fully equipped kitchen, and a balcony.',
        lat: '14.534157',
        lng: '120.986606',
        uploaderFirst: 'Melvin',
        uploaderLast: 'Arellano',
        uploaderId: '634aa9b6593b9b8e4e5a2fc2',
        tag: 'hotel',
        imageOne: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/383969973.jpg?k=64c14d46eab1a4a5d0b1eb11eeae3527fab4c66f0e66b2d781291f9815f0ae61&o=&hp=1',
        imageTwo: 'https://cf.bstatic.com/xdata/images/landmark/max1024/232229.webp?k=2a7081341e00530d2a075a9900d417cbd05867b98ba1e9f596a0e74eeb2d3e15&o=',
        imageThree: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/383969994.jpg?k=a2c2f5d49f10946bbaf1ebeebafdda85a302e624b429c4a60090faa6dd7ab52a&o=&hp=1',
        imageFour: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/383969958.jpg?k=1bbd3b3148edd709022b38af09a1cdd0945d506b45f9556327320ae5057dcb2f&o=&hp=1',
        dateCreated: `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`,
        review: [
            {
                id: `ObjectId("634aaed638c60a8ad27ca99b")`,
                fname: 'Yuju',
                lname: 'Cortez',
                review: 'Great location. Short taxi ride from NAIA, easy walk to Mall Of Asia with shopping & food.',
                dateCreated: 'October 15, 2022 09:01 PM'
            }
        ]
    },
    {
        name: 'Citadines Cebu City',
        description: 'Featuring sea views, Citadines Cebu City in Cebu City features accommodation, a restaurant, an outdoor swimming pool, a fitness centre and a garden. Complimentary WiFi is available and private parking is available on site.',
        lat: '10.313101',
        lng: '123.8947',
        uploaderFirst: 'Yuju',
        uploaderLast: 'Cortez',
        uploaderId: '634aaed638c60a8ad27ca99b',
        tag: 'hotel',
        imageOne: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/226432367.jpg?k=41b8a24bec8852cc34806b02ad7c4eb264e011eb28c34081eaf109e2f0bd95f8&o=&hp=1',
        imageTwo: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/220323648.jpg?k=af1b2a44ce5fbc673796fc0521136dc03610740aabefb3ef053d100b2d8049c5&o=&hp=1',
        imageThree: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/223267995.jpg?k=04243d163c6a17fa28800814043b7b6ce5dc782397de544b4673722c05f65853&o=&hp=1',
        imageFour: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/226432374.jpg?k=364814e18bf6163de3bf127764a49f166dd54302fa33b94afffa60ddd8719efd&o=&hp=1',
        dateCreated: `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`,
        review: [
            {
                id: `ObjectId("634aac8938c60a8ad27ca998")`,
                fname: 'David',
                lname: 'Smith',
                review: 'Very good location. Excellent customer service. Staff extremely courteous and helpful. Rooms came with kitchenette which made the stay great as I like to cook.',
                dateCreated: 'October 15, 2022 09:01 PM'
            }
        ]
    },
    {
        name: '88th Avenue',
        description: 'Located less than 1 km from Grand Convention Centre of Cebu, 88th Avenue offers a fitness centre, a bar and air-conditioned accommodation with a balcony and free WiFi. The accommodation features a hot tub and a sauna.',
        lat: '10.327777',
        lng: '123.909194',
        uploaderFirst: 'David',
        uploaderLast: 'Smith',
        uploaderId: '634aac8938c60a8ad27ca998',
        tag: 'hotel',
        imageOne: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/342999188.jpg?k=01121384fcb529fb4d8487262b795478f7590e76f0849cf9e71c509334beb997&o=&hp=1',
        imageTwo: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/346388547.jpg?k=d9a80037acc4a9052b8d5f8524042068a0478f08f8155cd9c11f31ee0504fcfd&o=&hp=1',
        imageThree: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/346854158.jpg?k=7aabf171b54c221ea363fa64214233516b1904452606f91a7829387e44811b75&o=&hp=1',
        imageFour: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/343900273.jpg?k=4c86db2a0c9712eeb01a1251cc9f20957396aa9dc5470694b43cd06cd4db7d53&o=&hp=1',
        dateCreated: `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`,
        review: [
            {
                id: `ObjectId("634aaed638c60a8ad27ca99b")`,
                fname: 'Yuju',
                lname: 'Cortez',
                review: 'I love how accessible the place is. Whether you are coming by for work or leisure this is the place to be. Great choices of restaurants and places to work.',
                dateCreated: 'October 15, 2022 09:01 PM'
            },
            {
                id: `ObjectId("634aa9b6593b9b8e4e5a2fc2")`,
                fname: 'Melvin',
                lname: 'Arellano',
                review: 'Elegant rooms. Very friendly and cooperative staff.',
                dateCreated: 'October 15, 2022 08:48 PM'
            },
            {
                id: `ObjectId("634aabfb38c60a8ad27ca986")`,
                fname: 'Kazuha',
                lname: 'Nakamura',
                review: 'Very good Security, nice people at the Front Desk and the shops and restaurants close by are buzzing with younger people.',
                dateCreated: 'October 15, 2022 08:48 PM'
            }
        ]
    }
]

function seeder(){
    console.log('\n********************************************************************\nArellano — This is seed.js.')

    // seed for accounts
    User.findOne({username: seedAccount[0].username}, function(err, pass){
        if (err) return
        if (pass){
            console.log('\nAccounts existed');
        }
        if (!pass){
            seedAccount.forEach(acc => {
                let accSeeder = new User(acc)

                accSeeder.save()
            })
            console.log('\nAccounts add\n ⇥ Accounts added:');
            console.table([
                {
                    name: 'Melvin Arellano',
                    username: 'admin',
                    password: 'admin'
                },
                {
                    name: 'Kazuha Nakamura',
                    username: 'zuha',
                    password: 'zuha'
                },
                {
                    name: 'David Smith',
                    username: 'dave',
                    password: 'dave'
                },
                {
                    name: 'Yuju Cortez',
                    username: 'yuju',
                    password: 'yuju'
                },
            ])
        }
    })

    // seed for places
    Place.findOne({name: seedPost[0].name}, function(err, pass){
        if (err) return
        if (pass){
            console.log('\nPost existed');
        }
        if (!pass){
            seedPost.forEach(seed => {
                let placeSeeder = new Place(seed)

                placeSeeder.save()

            })
            
            console.log('\nPlaces add\n ⇥ 5 places added!\n');
        }
    })

    console.log('\nServer ready. Enter node server / node server.js to start the server\n********************************************************************');
}

seeder()
