(function (root, factory) {
    /* istanbul ignore next */
    if (typeof root.define === 'function' && root.define.amd) {
        // AMD. Register as an anonymous module.
        root.define(['exports'], factory);
    } else if (typeof module === 'object') {
        // CommonJS
        module.exports = factory();
    } else {
        // Browser globals
        root.diff = factory();
    }
}(this, function () {

    var DIFF_NOT_MODIFIED = 0;
    var DIFF_CREATED = 1;
    var DIFF_MOVED = 2;
    var DIFF_DELETED = -1;

    /**
     * Calculates difference between two arrays.
     * List and prev. list:
     * 1 1 -> not changed
     * 2 2 -> not changed
     *   3 -> deleted
     * 4   -> created
     * 5   -> created
     *   6 -> deleted
     * Returns array of { item: T, state: int }.
     * Where state means: 0 - not modified, 1 - created, -1 - deleted.
     */
    function diff(list, prev) {
        var diff = [];
        var iList = 0;
        var iPrev = 0;

        for (; iList < list.length || iPrev < prev.length;) {
            var listItem = list[iList];
            var prevItem = prev[iPrev];

            if (iList >= list.length) {

                diff.push({ item: prevItem, state: DIFF_DELETED });
                ++iPrev;

            } else if (iPrev >= prev.length) {

                diff.push({ item: listItem, state: DIFF_CREATED });
                ++iList;

            } else if (listItem !== prevItem) {

                var prevItemIndex = prev.indexOf(listItem);
                var listItemIndex = list.indexOf(prevItem);

                var isCreated = prevItemIndex === -1;
                var isDeleted = listItemIndex === -1;

                if (isCreated) {
                    diff.push({ item: listItem, state: DIFF_CREATED });
                    ++iList;
                }

                if (!isCreated && !isDeleted) { // moved
                    diff.push({
                        item: listItem,
                        state: DIFF_MOVED,
                        oldIndex: prevItemIndex,
                        newIndex: iList
                    });
                    ++iList;
                    ++iPrev;
                }

                if (isDeleted) {
                    diff.push({ item: prevItem, state: DIFF_DELETED });
                    ++iPrev;
                }

            } else {
                diff.push({ item: listItem, state: DIFF_NOT_MODIFIED });
                ++iList;
                ++iPrev;
            }
        }

        return diff;
    }

    // exports ////////////////////////////////////////////////////////////////

    diff.NOT_MODIFIED = DIFF_NOT_MODIFIED;
    diff.CREATED = DIFF_CREATED;
    diff.MOVED = DIFF_MOVED;
    diff.DELETED = DIFF_DELETED;

    return diff;
}));