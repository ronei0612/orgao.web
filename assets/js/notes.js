const Notes = function (selector, tuner) {
    this.tuner = tuner;
    this.isAutoMode = false;
    this.$root = document.querySelector(selector);
    this.$notes = [];
    this.$notesMap = {};
};