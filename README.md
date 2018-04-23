****************************************************************************************************
	• Steps to mount drive under Ubuntu:
		• Install guest addition and mount drive bidirectional
		• Use sudo adduser yourusername vboxsf
	• Use below command to install required dependencies before superset setup
		
		• sudo apt-get install build-essential libssl-dev libffi-dev python-dev python-pip libsasl2-dev libldap2-dev
		• pip install --upgrade setuptools pip
	• Setup virtual environment (optional)
		pip install virtualenv
		virtualenv venv
        . ./venv/bin/activate
	• Follow below steps to install superset as prod
		# Install superset
            pip install superset
		# Create an admin user (you will be prompted to set username, first and last name before setting a password)
            fabmanager create-admin --app superset
		# Initialize the database
            superset db upgrade
		# Load some data to play with
            superset load_examples
		# Create default roles and permissions
            superset init
		# Start the web server on port 8081, use -p to bind to another port
            superset runserver
		# To start a development web server, use the -d switch
            superset runserver -d
	• Install latest version of node with below commands
		sudo apt install curl
		curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
        sudo apt-get install -y nodejs
	• Install yarn so dependencies can be installed faster
		sudo npm install -g yarn
		
	• Browse to folder superset/assets and run command yarn to install all dependencies before that run "yarn config set "strict-ssl" false" to resolve certificate issue.

	• Superset installation for development environment:
		# fork the repo on GitHub and then clone it
        # alternatively you may want to clone the main repo but that won't work
        # so well if you are planning on sending PRs
        # git clone git@github.com:apache/incubator-superset.git
		# [optional] setup a virtual env and activate it
            virtualenv env
            source env/bin/activate
		# install for development
            pip install -e .
		# Create an admin user
            fabmanager create-admin --app superset
		# Initialize the database
            superset db upgrade
		# Create default roles and permissions
            superset init
		# Load some data to play with
            superset load_examples
	
	• To parse and generate bundled files for superset, run either of the following commands. The dev flag will keep the npm script running and re-run it upon any changes within the assets directory.
		# Copies a conf file from the frontend to the backend
            npm run sync-backend
		# Compiles the production / optimized js & css
            npm run prod
		# Start a web server that manages and updates your assets as you modify them
            npm run dev
		
	• Run below commands in two different terminal by browsing under path superset/assets
		# superset runserver -d -p 8081
        # npm run dev
		
	• Additional commands that might need while installing superset:
		# If static folder error pop up's while installing superset then browse to superset/static folder and delete assets file and open cmd there and run below command, which will create symlink file to assets folder
			ln -s ../assets assets
		# For certificate related issue while installing node module
			yarn config set "strict-ssl" false
	
	• Installing MySQL client
		# sudo apt-get install python-dev python3-dev
		# sudo apt-get install libmysqlclient-dev
		# sudo pip install pymysql
		# sudo pip install mysqlclient
	
	• To add database under superset:
	 	# go to sources/databases, 
		# click + icon near add filter (make sure you are not connected to Deloitte network)
		# Database-->	hitachiplatform
		# SQLAlchemyURI-->	(mysql+pymysql://admin:********@13.59.177.123:3306/hitachiplatform)
		# ******** should be replaced with password and then Click test connection button, if it seems ok then save.