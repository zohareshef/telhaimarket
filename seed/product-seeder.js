var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/telhaimarket", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var products = [
    new Product({
        imagePath: 'https://www.atrakzya.co.il/images/itempics/5556664367002_130520201008241_large.jpg',
        title: 'סרגל',
        description: 'סרגל מתכת איכותי!',
        price: 10
    }),
    new Product({
        imagePath: 'https://d3m9l0v76dty0.cloudfront.net/system/photos/292473/large/846ff97029eb5a76e5cb2add22bb11c5.jpg',
        title: 'מחק',
        description: 'מחק מקצועי לתלמיד מבית סטדלר',
        price: 3
    }),
    new Product({
        imagePath: 'https://www.guyoffice.co.il/ProductsImages/W950020.jpg',
        title: 'טושים מדגישים',
        description: 'שש טושים מדגישים מבית סטבילו',
        price: 35
    }),
    new Product({
        imagePath: 'https://res.cloudinary.com/misradia/image/upload/c_scale,f_auto,h_440/images/items/5266/original-31982.JPEG',
        title: 'עפרונות זפיר',
        description: 'עפרונות עם מחק בקצה מותג זפיר מבית עפרונות ירושלים, 12 יחידות באריזה',
        price: 11
    }),
    new Product({
        imagePath: 'https://d3m9l0v76dty0.cloudfront.net/system/photos/2364296/large/1728ec54b7b73f9e64315e90f4fd6bcf.jpg',
        title: 'סט עפרונות צבעוני מסיס במים',
        description: ' סט 24 עפרונות אקוורל מסיסים במים צבעוניים מתוצרת סטדלר מאפשרים מגוון רחב של אפשרויות ציור וצביעה במגע מים עם מכחול צבעי העפרונות עשירים ',
        price: 36
    }),
    new Product({
        imagePath: 'https://d3m9l0v76dty0.cloudfront.net/system/photos/2364331/large/d3008993d1a74418be031b9d5106b93d.jpg',
        title: 'מחדד',
        description: 'מחדד-כפול מתכתי 510-20 תוצרת STAEDTLER גרמניה חור חידוד לעיפרון עד קוטר 82 ממ עד לזווית חידוד של 23 מעלות וחור נוסף לחידוד עיפרון עד קוטר 102 ממ',
        price: 7
    }),
    new Product({
        imagePath: 'https://www.atrakzya.co.il/images/itempics/4064039084178_15072020165602_large.jpg',
        title: 'קלמר',
        description: 'קלמר אדידס מקורי, 2 תאים בצבע שחור',
        price: 39
    }),
    new Product({
        imagePath: 'https://cdn.groo.co.il/_media/media/23212/232938.jpg',
        title: 'תיק גב',
        description: 'תיק גב סוויס עשוי מבד קנבאס בליסטי עם 4 תאים מרכזיים ו-2 תאים בצדדים.',
        price: 99
    }),
    new Product({
        imagePath: 'https://www.goldbooks.co.il/assets/pics/medium/41461559637203.jpg',
        title: 'מחברת ספירלה',
        description: 'כריכת פלסטיק - נושא אחד',
        price: 13
    }),
    new Product({
        imagePath: 'https://res.cloudinary.com/misradia/image/upload/c_scale,f_auto,h_440/images/items/589/original-32355.JPEG',
        title: 'עט פיילוט',
        description: 'עט רולר גל כדורי עם כרית לאחיזה נוחה ולחצן',
        price: 10
    }),
    new Product({
        imagePath: 'https://res.cloudinary.com/misradia/image/upload/c_scale,f_auto,h_440/images/items/9294/original-31550.JPEG',
        title: 'קלסר',
        description: 'קלסר איכותי עם חיזוק מתכת בפינות וראדו בדופן הקלסר',
        price: 8
    }),
    new Product({
        imagePath: 'https://accvaloreti.azureedge.net/images/11a40103-ac65-4b38-9273-1a09606d1785_500.jpg',
        title: 'טוש שחור',
        description: 'לורד ארטליין 700 - שחור',
        price: 7
    }),
];
var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function (err, result) {
        done++;
        if (done == products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
