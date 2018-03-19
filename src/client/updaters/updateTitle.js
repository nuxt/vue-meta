export default function _updateTitle () {
  /**
   * Updates the document title
   *
   * @param  {String} title - the new title of the document
   */
  return function updateTitle (title = document.title) {
    document.title = title
  }
}
