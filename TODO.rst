TODO list (varius bugs, tweaks and ideas)


 * Bugs/annoyances

  - time part of date is not displayed at all
  - Binary and Code data types are not supported by python json_utility
   (the only way to use them is to traverse json and manually replace Binary/Code objects)
  - discover list of sort candidates from json properly
  - disable collection view when there is no db selected
  - clear/set sort/page options on page change and collection switch in collection view
  - introduce some menu interface, currently ordering is now unpredictable and plugins just mess with dom


  * Ideas

  - use service for collecting user comments/reviews
  - help system
  - consider async solution for server side 
   (tornado, node.js or erlang are good candidates)
  - console with full mongo syntax support, maybe pyv8 could be usefull
  - how about implementing mongo driver entirely in js on browser side with websockets?
  - db/collection disk usage charts
  - inline editor, double click value to change it, or right click to operate it ( like add to query builder)
  - maintain collection of usefull mongodb data dumps for tutorial purpose
  - write fom tutorial as introduction to mongodb
  - add twitter stream and user count to online demo
  - linking fom_objects, so multiple server/database/collection connections are possible
  - json view expander: allow expanded fully or only first level and expansion of subelements
   
