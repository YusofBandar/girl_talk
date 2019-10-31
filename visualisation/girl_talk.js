
const trackPath = "../data/all_day/oh_no.json";

d3.json(trackPath).then((data) => {
    console.log(data);
}).catch((err) => {
    console.error(err);
})