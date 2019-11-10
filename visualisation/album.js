class Album {

    constructor(albumPath) {
        this.albumPath = albumPath;
        this.selected = false;
        this._init();
    }

    _init() {
        d3.json(this.albumPath).then((album) => {
            this.album = album;

            const albumWidth = window.innerWidth < 450 ? 250 : 350;

            let scope= this;
            let artWork = d3.select("body")
                .append("img")
                .attr("src", album.artWork)
                .style("width", `${albumWidth}px`)
                .style("height", `${albumWidth}px`)
                .style("padding", "100px")
                .on("mouseover", function () {
                    if(!scope.selected){
                        d3.select(this)
                        .transition()
                        .duration(1000)
                        .style("width", `${albumWidth + 50}px`)
                        .style("height", `${albumWidth + 50}px`);
                    }
                })
                .on("mouseout", function () {
                    console.log(scope.selected);
                    if(!scope.selected){
                        d3.select(this)
                        .transition()
                        .duration(1000)
                        .style("width", `${albumWidth}px`)
                        .style("height", `${albumWidth}px`);
                    }
                })
                .on("click", function () {
                    scope.selected = true;
                    let div = d3.select("body")
                        .append("div")
                        .attr("id", album.title);

                    d3.select(this)
                        .transition()
                        .duration(800)
                        .ease(d3.easeExp)
                        .style("width", `${window.innerWidth - 100}px`)
                        .style("height", `${window.innerWidth - 100}px`)
                        .style("padding", "0px")
                        .style("z-index","-99")
                        .style("position","fixed")
                        .on("end", () => {
                            album.tracks.forEach(track => {
                                new Record(div, track.dataPath, track.audioPath);
                            });
                        })



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