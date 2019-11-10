class Album{

    constructor(albumPath){
        this.albumPath = albumPath;
        
        this._init();
    }

    _init(){
        d3.json(this.albumPath).then((album) =>{
            this.album = album;
            
            console.log();

            d3.select("body")
                .append("img")
                .attr("src",album.artWork)
                .style("width","350px")
                .style("height","350px")
                .style("padding","50px")

        }).catch((err) => {
            console.log(err)
        })
    }
}




let albums = ["../data/all_day.json","../data/all_day.json"];

albums.forEach(album => {
    new Album(album)
});