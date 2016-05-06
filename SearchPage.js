'use strict';
 
var React = require('react-native');
// var SearchResults = require('./SearchResults');
var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component
} = React;



var styles = StyleSheet.create({
	description: {
		marginBottom: 20,
		fontSize: 18,
		textAlign: 'center',
		color: '#656565'
	},
	container: {
		padding: 30,
		marginTop: 65,
		alignItems: 'center'
	},
	flowRight: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'stretch'
	},
	buttonText: {
		fontSize: 18,
		color: 'white',
		alignSelf: 'center'
	},
	button: {
		height: 36,
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#48BBEC',
		borderColor: '#48BBEC',
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 10,
		alignSelf: 'stretch',
		justifyContent: 'center'
	},
	searchInput: {
		height: 36,
		padding: 4,
		marginRight: 5,
		flex: 4,
		fontSize: 18,
		borderWidth: 1,
		borderColor: '#48BBEC',
		borderRadius: 8,
		color: '#48BBEC'
	},
	image: {
		width: 217,
		height: 138
	}
});

function urlForQueryAndPage(key, value, pageNumber) {
  var data = {
      country: 'uk',
      pretty: '1',
      encoding: 'json',
      listing_type: 'buy',
      action: 'search_listings',
      page: pageNumber
  };
  data[key] = value;
 
  var querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');
 
  return 'http://api.nestoria.co.uk/api?' + querystring;
};



class SearchPage extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
	    searchString: 'screen-name',
	    isLoading: false
	  };
	}
	onSearchTextChanged(event) {
	  console.log('onSearchTextChanged');
	  this.setState({ searchString: event.nativeEvent.text });
	  console.log(this.state.searchString);
	}
	// _executeQuery(query) {
	//   console.log(query);
	//   this.setState({ isLoading: true });
	//   fetch(query)
	//   .then(response => response.json())
	//   .then(json => this._handleResponse(json.response))
	//   .catch(error =>
	//      this.setState({
	//       isLoading: false,
	//       message: 'Something bad happened ' + error
	//    }));
	// }
	// setState changes variables
	_handleResponse(response) {
		// shows the JSON object
	  console.log(response);
	  this.setState({ isLoading: false , message: '' });
	  if (response.application_response_code.substr(0, 1) === '1') {
	    this.props.navigator.push({
			  title: 'Results',
			  component: SearchResults,
			  passProps: {listings: response.listings}
			});
	  } else {
	    this.setState({ message: 'Location not recognized; please try again.'});
	  }
	}
	 
	onSearchPressed() {
	  var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
	  this._executeQuery(query);
	}

	onTwitterSearch() {
		console.log("searchName: ", this.state.searchString);

		var searchTerm = this.state.searchString;

		//https://api.twitter.com/1.1/friends/list.json?cursor=-1&screen_name=twitterapi&skip_status=true&include_user_entities=false

		// keep going until cursor with next until it hits 0.
		var friendsListUrl = "https://api.twitter.com/1.1/friends/list.json?cursor=-1&" + searchTerm + "=twitterapi&skip_status=true&include_user_entities=false";
		// console.log("*** friendsList ***", friendsList);
		var xmlhttp = new XMLHttpRequest();
// var url = "myTutorials.txt";

		xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		    var myArr = JSON.parse(xmlhttp.responseText);
		    myFunction(myArr);
		    }
		};

		var friendsList = xmlhttp.open("GET", friendsListUrl, true);
		var friendsList = xmlhttp.send();
		console.log("*** friendsList ***", friendsList);

	}

	// onLocationPressed() {
	//   	navigator.geolocation.getCurrentPosition(
	//     	location => {
	// 	      	var search = location.coords.latitude + ',' + location.coords.longitude;
	// 	      	this.setState({ searchString: search });
	// 	      	var query = urlForQueryAndPage('centre_point', search, 1);
	// 	      	this._executeQuery(query);
	//     	},
	//     	error => {
	//       	this.setState({
	//         	message: 'There was a problem with obtaining your location: ' + error
	//       	});
 //    	});
	// }


  render() {
    return (
	<View style={styles.container}>
        <Text style={styles.description}>
        Search by screen-name and the locations of all the user's friends.
        </Text>
        <View style={styles.flowRight}>
		 	<TextInput
			style={styles.searchInput}
			value={this.state.searchString}
			onChange={this.onSearchTextChanged.bind(this)}
			placeholder='Search via screen-name'/>
		 	<TouchableHighlight style={styles.button}
		  		onPress={this.onTwitterSearch.bind(this)}
		      	underlayColor='#99d9f4'>
		    <Text style={styles.buttonText}>Search</Text>
		  </TouchableHighlight>
		<Text style={styles.description}>{this.state.message}</Text>
		</View>
    </View>
    );
  }
}

module.exports = SearchPage;