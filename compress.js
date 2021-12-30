var brotli = require('brotli');
var fs = require('fs');
const { Z_FIXED } = require('zlib');
var args = process.argv;

if (args[0].includes("node.exe")) {
    args.shift(0)
}
if (args[0] === __filename || args[1] === __filename) {
    args.shift(0);
}

var mode, filename;
if (args[0].startsWith('-') || args[0].startsWith('--')) {
    mode = args[0] || '-d';
    filename = args[1] || '';
} else {
    mode = '-c';
    filename = args[0];
}

if (filename !== "") {
    if (fs.existsSync(filename)) {
        if (mode === '-d' || mode === '--d' || mode === '-decompress' || mode === '--decompress') {
            let newFilename = "";
            if (filename.split("").reverse().join("").startsWith("rb.")) {
                newFilename = filename.slice(0, -3);
            }
            if (fs.existsSync(newFilename)) {
                fs.unlinkSync(newFilename);
            }
            console.log(filename)
            fs.writeFile(newFilename, brotli.decompress(fs.readFileSync(filename)), function(err) {
                if(err) {
                    return console.log(err.message);
                }
                console.log("The decompressed file as name of " + newFilename + " was saved!");
            });
        } else if (mode === '-c' || mode === '--c' || mode === '-compress' || mode === '--compress') {
            fs.readFile(filename, "utf8", function(err, data) {
                if (err) {
                    return console.log(err.message);
                }
                let newFilename = filename + ".br";
                if (fs.existsSync(newFilename)) {
                    fs.unlinkSync(newFilename);
                }
                fs.writeFile(newFilename, brotli.compress(data), function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("The compressed file as name of " + newFilename + " was saved!");
                });
            });
        }
    } else {
        console.log("Opps ! (>_<)? " + filename + " is not existing ✔✔✔")
    }
} else {
    console.log("Opps ! (>_<)? Please input the filename to compress or depress ✔✔✔")
}