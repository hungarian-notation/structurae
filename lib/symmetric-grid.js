/**
 * Creates a SymmetricGrid class extending a given Array-like class.
 *
 * @param {CollectionConstructor} Base
 * @returns {SymmetricGrid}
 * @example
 *
 * const SymmetricGrid = SymmetricGridMixin(Array);
 */
function SymmetricGridMixin(Base) {
  /**
   * @extends CollectionConstructor
   */
  class SymmetricGrid extends Base {
    /**
     * Passes all arguments to the Base class except if called with a special set of grid options,
     * in that case creates and empty grid of specified parameters.
     *
     * @param {Object} [options]
     * @param {number} [options.rows=2] the number of rows
     * @param {*} [options.pad=0] the initial value of cells
     * @param {Collection} [data]
     * @example
     *
     * new SymmetricGrid('a')
     * //=> SymmetricGrid ['a']
     *
     * new SymmetricGrid(2)
     * //=> SymmetricGrid [undefined, undefined]
     *
     * new SymmetricGrid({ rows: 3 })
     * //=> SymmetricGrid [0, 0, 0, 0]
     *
     * new SymmetricGrid({ rows: 3, pad: 1 })
     * //=> SymmetricGrid [1, 1, 1, 1]
     */
    constructor(options = {}, data) {
      const { rows = 2, pad = 0 } = options;
      if (data && data.length) {
        super(data);
      } else {
        const length = (rows + 1) * (rows / 2);
        super(length);
        this.fill(pad);
      }
      Object.defineProperties(this, {
        pad: { value: pad, writable: true },
        lastCoordinates: { value: Object.seal({ row: 0, column: 0 }) },
      });
    }

    get rows() {
      return (Math.sqrt((this.length << 3) + 1) - 1) >> 1;
    }

    /**
     * Returns an array index of an element at given coordinates.
     *
     * @param {number} row
     * @param {number} column
     * @returns {*}
     * @example
     *
     * const a = SymmetricGrid({ rows: 3 });
     * a.get(1, 0);
     * //=> 1
     * a.get(0, 1);
     * //=> 1
     */
    static getIndex(row, column) {
      const [x, y] = row >= column ? [column, row] : [row, column];
      return x + (((y + 1) * y) >> 1);
    }

    /**
     * Returns an element from given coordinates.
     *
     * @param {number} row
     * @param {number} column
     * @returns {*}
     * @example
     *
     * const a = SymmetricGrid({ rows: 3, pad: 3});
     * a.get(0, 1);
     * //=> 3
     */
    get(row, column) {
      return this[this.constructor.getIndex(row, column)];
    }

    /**
     * Sets the element at given coordinates.
     *
     * @param {number} row
     * @param {number} column
     * @param {*} value
     * @returns {SymmetricGrid} the instance
     * @example
     *
     * const a = SymmetricGrid({ rows: 3, pad: 3});
     * a.set(0, 1, 5);
     * a.get(0, 1);
     * //=> 5
     */
    set(row, column, value) {
      this[this.constructor.getIndex(row, column)] = value;
      return this;
    }

    /**
     * Gets coordinates of an element at specified index.
     *
     * @param {number} index
     * @returns {Coordinates} coordinates
     * @example
     * const a = SymmetricGrid({ rows: 3, pad: 3});
     * a.getCoordinates(1);
     * //=> [0, 1]
     * a.getCoordinates(2);
     * //=> [1, 1]
     */
    getCoordinates(index) {
      const row = (Math.sqrt((index << 3) + 1) - 1) >> 1;
      this.lastCoordinates.row = row;
      this.lastCoordinates.column = index - ((row * (row + 1)) >> 1);
      return this.lastCoordinates;
    }

    /**
     * Returns an array of arrays where each nested array correspond to a row in the grid.
     *
     * @returns {Array<Array<*>>}
     * @example
     *
     * const a = SymmetricGrid.from([[1, 2, 4], [2, 3, 5], [4, 5, 6]])
     * //=> SymmetricGrid [1, 2, 3, 4, 5, 6]
     * a.toArrays();
     * //=> Array [[1, 2, 4], [2, 3, 5], [4, 5, 6]]
     */
    toArrays() {
      const { rows } = this;
      const arrays = new Array(rows).fill(0).map(() => []);
      let k = 0;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j <= i; j++) {
          arrays[i][j] = this[k];
          arrays[j][i] = this[k];
          k++;
        }
      }
      return arrays;
    }

    /**
     * @type {CollectionConstructor}
     */
    static get [Symbol.species]() {
      return Base;
    }

    /**
     * Creates a grid from an array of arrays.
     *
     * @param {Array<Array<*>>} arrays
     * @param {*} [pad=0] the value to pad the arrays to create equal sized rows
     * @returns {SymmetricGrid}
     *
     * const a = SymmetricGrid.from([[1, 2, 4], [2, 3, 5], [4, 5, 6]])
     * //=> SymmetricGrid [1, 2, 3, 4, 5, 6]
     * a.get(1, 0);
     * //=> 2
     * a.get(2, 1);
     * //=> 4
     */
    static fromArrays(arrays, pad = 0) {
      const rows = arrays.length;
      const grid = new this({ rows, pad });
      let k = 0;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j <= i; j++) {
          grid[k] = arrays[i][j];
          k++;
        }
      }
      return grid;
    }
  }

  return SymmetricGrid;
}

module.exports = SymmetricGridMixin;