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

            let scope = this;
            let records;
            let size;
            let artWork = d3.select("body")
                .append("img")
                .attr("class", "artwork")
                .attr("id", `artwork_${album.title}`)
                .attr("src", album.artWork)
                .style("width", `${albumWidth}px`)
                .style("height", `${albumWidth}px`)
                .style("padding", "100px")
                .on("mouseover", function () {
                    if (!scope.selected) {
                        d3.select(this)
                            .transition()
                            .duration(1000)
                            .style("width", `${albumWidth + 50}px`)
                            .style("height", `${albumWidth + 50}px`);
                    }
                })
                .on("mouseout", function () {
                    console.log(scope.selected);
                    if (!scope.selected) {
                        d3.select(this)
                            .transition()
                            .duration(1000)
                            .style("width", `${albumWidth}px`)
                            .style("height", `${albumWidth}px`);
                    }
                })
                .on("click", function () {


                    let selected = d3.select(this);

                    let artworks = d3.select("body").selectAll(".artwork");
                    artworks.each(function () {
                        let el = d3.select(this);
                        let selectedId = selected.attr("id");

                        if (el.attr("id") !== selectedId) {
                            el.style("z-index", "-100");
                        }
                    })

                    scope.selected = true;
                    records = d3.select("body")
                        .append("div")
                        .attr("id", album.title)
                        .attr("class", "centre")
                        .style("width", "100%");


                    size = Math.max(window.outerWidth, window.outerHeight) + 500;

                    d3.select("body")
                        .append("div")
                        .attr("class", "screen")
                        .style("width", `${size}px`)
                        .style("height", `${size - 100}px`)
                        .style("padding", "0px")
                        .style("z-index", "-50")
                        .style("position", "fixed")
                        .style("background-color", "#0000006e")
                        .style("opacity", "0")
                        .transition()
                        .duration(800)
                        .ease(d3.easeExp)
                        .style("opacity", "1")
                        .style("backdrop-filter", "blur(15px)")

                    let coords = selected.node().getBoundingClientRect();



                    selected
                        .style("position", "fixed")
                        .style("top", `${coords.top}px`)
                        .style("right", `${coords.right}px`)
                        .style("bottom", `${coords.bottom}px`)
                        .style("left", `${coords.left}px`)
                        .transition()
                        .duration(800)
                        .ease(d3.easeExp)
                        .style("width", `${size}px`)
                        .style("height", `${size - 100}px`)
                        .style("padding", "0px")
                        .style("z-index", "-99")
                        .style("top", "0px")
                        .style("right", "0px")
                        .style("bottom", "0px")
                        .style("left", "0px")
                        .on("end", () => {

                            // hide other albums
                            artworks.each(function () {
                                let el = d3.select(this);
                                let selectedId = selected.attr("id");
        
                                if (el.attr("id") !== selectedId) {
                                    el.style("display","none")
                                }
                            })


                            d3.select("body")
                                .style("background-color", "black")

                            // add records
                            album.tracks.forEach(track => {
                                let record = records
                                    .append("div")
                                    .attr("id", track.title)
                                    .attr("class", "record");

                                record.append("h1")
                                    .text(track.title);

                                new Record(record, track.dataPath, track.audioPath);
                            });

                            // scroll to the top
                            window.scrollTo(0, 0);
                        }).style("position", "fixed")
                })



            window.addEventListener("scroll", () => {
                let top = window.pageYOffset || document.body.scrollTop;
                let recordsHeight = album.tracks.length * 2000;
                let dy = this.mapNumRange(top, 0, recordsHeight, 0, size);
                artWork.style("top", `${-dy}px`);
            });

        }).catch((err) => {
            console.log(err)
        })
    }

    mapNumRange(num, inMin, inMax, outMin, outMax) {
        return (((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin);
    }

}




let albums = ["../data/all_day.json", "../data/test.json"];

albums.forEach(album => {
    new Album(album)
});