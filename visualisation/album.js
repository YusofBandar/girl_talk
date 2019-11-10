class Album {

    constructor(albumPath) {
        this.albumPath = albumPath;

        this._init();
    }

    _init() {
        d3.json(this.albumPath).then((album) => {
            this.album = album;

            const albumWidth = window.innerWidth < 450 ? 250 : 350;

            let artWork = d3.select("body")
                .append("img")
                .attr("src", album.artWork)
                .style("width", `${albumWidth}px`)
                .style("height", `${albumWidth}px`)
                .style("padding", "100px")
                .on("mouseover", function () {
                    d3.select(this)
                        .transition()
                        .duration(1000)
                        .style("width", `${albumWidth + 50}px`)
                        .style("height", `${albumWidth + 50}px`)
                })
                .on("mouseout", function () {
                    d3.select(this)
                        .transition()
                        .duration(1000)
                        .style("width", `${albumWidth}px`)
                        .style("height", `${albumWidth}px`)
                })
                .on("click", function () {

                    d3.select(this)
                        .transition()
                        .duration(800)
                        .ease(d3.easeExp)
                        .style("width", `${window.innerWidth-100}px`)
                        .style("height", `${window.innerWidth-100}px`)
                        .style("padding", "0px")
                        .style("position", "fixed")
                        
                })

        }).catch((err) => {
            console.log(err)
        })
    }
}




let albums = ["../data/all_day.json"];

albums.forEach(album => {
    new Album(album)
});