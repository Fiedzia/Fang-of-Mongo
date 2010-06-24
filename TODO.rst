TODO list (varius bugs, tweaks and ideas)


 * Bugs/annoyances

  - Binary and Code data types are not supported by python json_utility.
   (the only way to use them is to traverse json and manually replace Binary/Code objects)
  - Regular exression type g flag is ommited by python driver ( because it doesn't exist in python )
  - properly discover list of sort candidates from json structure
  - introduce some menu interface, currently ordering is now unpredictable and plugins just mess with dom
  - document edition:
    after editing coloring of odd documents doesn't work, also collapse/expand button ignores them
  -  allow adding new / removing documents
    changing _id generates new document. Thats might require help information, some people might be surprised
  - add no_collection_selected signal


  * Ideas

  - use service for collecting user comments/reviews
  - help system
  - consider async solution for server side 
   (tornado, node.js or erlang are good candidates)
  - console with full mongo syntax support, maybe pyv8 could be usefull. Other solution is to popen mongo.
  - how about implementing mongo driver entirely in js on browser side with websockets? (what about support for binary data in browser?)
  - db/collection disk usage charts
  - inline editor, double click value to change it, or right click to operate it ( like add to query builder)
  - maintain collection of usefull mongodb data dumps for tutorial purpose
  - write fom tutorial as introduction to mongodb
  - chaining fom_objects, so multiple server/database/collection connections are possible
  - json view expander: allow expanded fully or only first level and expansion of subelements
  - debug window/ console
  - show query execution time/data loading time
  - show index /stats info when hovering over respective buttons for longer time
  - highlight syntax when editing JSON, good editor component is here: marijn.haverbeke.nl/codemirror/
  - when editing document, textarea should have the same height as document



* Release:

  - feedback tracking
  - field autocomplete
  - error reporting?
  - register_plugin
  - zip archive
  - check available updates ?
  - spinner in item lists
