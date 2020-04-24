import { types } from "mobx-state-tree";
import { urlExists } from "./URL";

const BeginEndBin = types.optional(types.array(types.integer), [1, 140]);
const ChunkURLs = types.optional(types.array(types.string), [""]);

const PathNucPos = types.model("PathNucPos", {
  path: types.string,
  nucPos: types.integer,
});

export let RootStore; // AG: why is it exported?
RootStore = types
  .model({
    useVerticalCompression: false,
    useWidthCompression: false,
    binScalingFactor: 3,
    useConnector: true,
    beginEndBin: BeginEndBin,
    pixelsPerColumn: 10,
    pixelsPerRow: 7,
    leftOffset: 25,
    topOffset: 400,
    highlightedLink: 0, // we will compare linkColumns
    maximumHeightThisFrame: 150,
    cellToolTipContent: "",

    // AG: to change 'jsonName' in 'jsonNameDir'???
    jsonName: "run1.B1phi1.i1.seqwish",

    // AG: added new attribute.
    availableZoomLevels: types.optional(types.array(types.string), ["1"]),

    // AG: added new attribute.
    indexSelectedZoomLevel: 0,

    chunkURLs: ChunkURLs,
    pathNucPos: types.optional(PathNucPos, { path: "path", nucPos: 0 }), // OR: types.maybe(PathNucPos)
    pathIndexServerAddress: "http://193.196.29.24:3010/",
    binWidth: 100,
    nucleotideHeight: 10,
    pangenomelast_bin: -1,
    // TODO: Set when bin2file is read
  })
  .actions((self) => {
    function updateBeginEndBin(newBegin, newEnd) {
      /*This method needs to be atomic to avoid spurious updates and out of date validation.*/
      newBegin = Math.max(1, Math.round(newBegin));
      newEnd = Math.max(1, Math.round(newEnd));
      const beginBin = getBeginBin();
      const endBin = getEndBin();
      if (newEnd === endBin) {
        //end has not changed
        let diff = endBin - beginBin;
        newEnd = newBegin + diff; //Allows start to push End to new chunks
      }
      if (newEnd < newBegin) {
        //crush newStart
        newBegin = newEnd - 1;
      }
      setBeginEndBin(newBegin, newEnd);
      console.log("updateBeginEnd: " + newBegin + " " + newEnd);
      console.log(
        "updatedBeginEnd: " + self.beginEndBin[0] + " " + self.beginEndBin[1]
      );
    }
    function updateTopOffset(newTopOffset) {
      if (Number.isFinite(newTopOffset) && Number.isSafeInteger(newTopOffset)) {
        self.topOffset = newTopOffset + 10;
      }
    }
    function updateBinScalingFactor(event) {
      let newFactor = event.target.value;
      self.binScalingFactor = Math.max(1, Number(newFactor));
    }
    function updateHighlightedLink(linkRect) {
      self.highlightedLink = linkRect;
    }
    function updateMaxHeight(latestHeight) {
      self.maximumHeightThisFrame = Math.max(
        self.maximumHeightThisFrame,
        latestHeight
      );
    }
    function resetRenderStats() {
      self.maximumHeightThisFrame = 1;
    }
    function updateCellTooltipContent(newContents) {
      self.cellToolTipContent = String(newContents);
    }
    function toggleUseVerticalCompression() {
      self.useVerticalCompression = !self.useVerticalCompression;
    }
    function toggleUseWidthCompression() {
      self.useWidthCompression = !self.useWidthCompression;
    }
    function toggleUseConnector() {
      self.useConnector = !self.useConnector;
    }
    function updateHeight(event) {
      self.pixelsPerRow = Math.max(1, Number(event.target.value));
    }
    function updateWidth(event) {
      self.pixelsPerColumn = Number(event.target.value);
    }

    function tryJSONpath(event) {
      const url =
        process.env.PUBLIC_URL +
        "test_data/" +
        event.target.value +
        "/bin2file.json";
      if (urlExists(url)) {
        self.jsonName = event.target.value;
      }
    }

    function switchChunkURLs(arrayOfFile) {
      let arraysEqual =
        arrayOfFile.length === self.chunkURLs.length &&
        arrayOfFile.every((e) => self.chunkURLs.indexOf(e) > -1);
      if (!arraysEqual) {
        self.chunkURLs = arrayOfFile;
        console.log("arrayOfFile: " + arrayOfFile);
      }
    }
    function getChunkURLs() {
      return self.chunkURLs;
    }
    function getBeginEndBin() {
      return self.beginEndBin;
    }
    function getBeginBin() {
      return getBeginEndBin()[0];
    }
    function getEndBin() {
      return getBeginEndBin()[1];
    }

    // AG: added getter and setter for zoom info management
    function getSelectedZoomLevel() {
      return self.availableZoomLevels[self.indexSelectedZoomLevel];
    }
    function getIndexSelectedZoomLevel() {
      return self.indexSelectedZoomLevel;
    }
    function setIndexSelectedZoomLevel(index) {
      self.indexSelectedZoomLevel = index;
    }
    function decIndexSelectedZoomLevel() {
      if (self.indexSelectedZoomLevel > 0) {
        self.indexSelectedZoomLevel -= 1;
      }
    }
    function incIndexSelectedZoomLevel() {
      if (self.indexSelectedZoomLevel < self.availableZoomLevels.length - 1) {
        self.indexSelectedZoomLevel += 1;
      }
    }
    function getAvailableZoomLevels() {
      return self.availableZoomLevels;
    }
    function setAvailableZoomLevels(availableZoomLevels) {
      self.availableZoomLevels = availableZoomLevels;
    }

    function setBeginEndBin(newBeginBin, newEndBin) {
      self.beginEndBin = [newBeginBin, newEndBin];
    }
    function getPath() {
      return self.pathNucPos.path;
    }
    function getNucPos() {
      return self.pathNucPos.nucPos;
    }
    function getPathNucPos() {
      return self.pathNucPos;
    }
    function updatePathNucPos(path, nucPos) {
      if (nucPos) {
        nucPos = parseInt(nucPos);
      } else {
        nucPos = 0;
      }
      self.pathNucPos = { path: path, nucPos: nucPos };
    }
    function setBinWidth(binWidth) {
      self.binWidth = binWidth;
    }
    return {
      updateBeginEndBin,
      updateTopOffset,
      updateHighlightedLink,
      updateMaxHeight,
      resetRenderStats,
      updateCellTooltipContent,
      updateBinScalingFactor,
      toggleUseVerticalCompression,
      toggleUseWidthCompression,
      toggleUseConnector,
      updateHeight,
      updateWidth,
      tryJSONpath,
      switchChunkURLs,
      getChunkURLs,
      getBeginEndBin,
      getBeginBin,
      getEndBin,
      getPath,
      getNucPos,
      getPathNucPos,
      updatePathNucPos,
      setBinWidth,

      // AG: added zoom actions
      getSelectedZoomLevel,
      setIndexSelectedZoomLevel,
      getIndexSelectedZoomLevel,
      decIndexSelectedZoomLevel,
      incIndexSelectedZoomLevel,
      getAvailableZoomLevels,
      setAvailableZoomLevels,
    };
  })
  .views((self) => ({}));

export const store = RootStore.create({});
