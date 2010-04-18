Fang of Mongo - web based user interface for MongoDB build with django and jquery.

It will allow you to explore content of mongodb with simple but (hopefully) pleasant
user interface.

Curren status:

Fang of mongo is actually rather proof of concept for mongo ui then anything working properly.
Expect all kinds of bugs and limitations. This is work in progress.

For installation instruction, see INSTALL file
To get the idea of code internals, see code_hacking.txt

INSTALLATION:

 * Ubuntu 10.04:
   - requirements:
       sudo aptitude install python-setuptools, mongodb, python-django

       sudo easy_install pymongo

  - installation:
      grab archive using either:
          - git: git clone http://github.com/Fiedzia/Fang-of-Mongo.git

          - webbrowser: http://github.com/Fiedzia/Fang-of-Mongo/archives/fom_object

            download archive and unpack into directory of your choice

      after downloading, open console, cd to directory where the files are and type:

          cd fangofmongo

          python ./manage.py runserver

          now point your browser to http://localhost:8000/fangofmongo/ and enjoy


Project goals:

  - allow users to easily explore mongdb content
    and any metainformation it may provide
  - Long term goal is to being able to perform any operation that can be done using mongodb console

TODO (in order of importance):

  - display collection content in nicely formatted way
  - allow to easily filter and sort data
  - make sure fom works correctly (by creating unittests and usable dataset)
  - rethinking plugin interface
  - CRUD operations
  - collection and db operations
  - data export (html, json, csv, xml)
  - support for database credentials
  - user management
  - implement some form of mongo console

UI comments (thanks matt):

  1.) Look at jquery ui autocomplete for the searches. 
  2.) Less draggable area dont allow it to cover the top menu. 
  3.) Wider text boxes with larger font. 
  4.) More margin between elements (pretty much everywhere) 
  5.) Effects / transitions between panes. 
  6.) Ive always though YAML has the best way to cleanly show 
      collections. http://yaml.org/spec/1.0/#id2489726  If that can be 
      extended so that every array or object can be shown or hidden by the 
      user that would be a huge win. 
  7.) If your going with the whole draggable idea, why not make it so 
      that you can open more than one collection at once and be able to 
      minimize them. 
      See: http://desktop.sonspring.com/ for ideas. 
      
  Down the road ideas: 
  1.) Completely themeable using the theme roller with all the pre-built 
      themes as an option right in the page itself. 
  2.) Drag and drop query builder with all of the special variables 
     ($set, $unset ect...)  similar to the MySQL workbench query builder. 
  3.) Full set of CRUD operations to perform on the database.




author: Maciej Dziardziel (fiedzia@gmail.com)
website:i http://github.com/Fiedzia/Fang-of-Mongo
twitter: @fangofmongo
