

import React from "react"
import Head from 'next/head'



import fetch from "isomorphic-fetch";
import { compose, withProps, lifecycle } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
import geo_data from './geo_data.json'

const MapWithAMarkerClusterer = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{
	    height: `300px`,
	    width:`900px` 
	 	}} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentWillMount() {
      this.setState({ markers: [] })
    },

    componentDidMount() {

      // const url = [
      //   // Length issue
      //   `https://gist.githubusercontent.com`,
      //   `/farrrr/dfda7dd7fccfec5474d3`,
      //   `/raw/758852bbc1979f6c4522ab4e92d1c92cba8fb0dc/data.json`
      // ].join("")

      // fetch(url)
      //   .then(res => res.json())
      //   .then(data => {
      //     this.setState({ markers: data.photos });
      //   });

  	// geo_data.map(data => { this.setState({ markers: data.photos }) 
  	// // 	console.log(data)
  	// })
  	const data_photo = {"photos": [
  {
    "photo_id": 1,
    "longitude": -101,
    "latitude": 37
  },
  {
    "photo_id": 2,
    "longitude": -100,
    "latitude": 31
  },
  {
    "photo_id": 3,
    "longitude": -97,
    "latitude": 31
  },
  {
    "photo_id": 4,
    "longitude": -96,
    "latitude": 30
  },
  {
    "photo_id": 5,
    "longitude": -100,
    "latitude": 32
  },
  {
    "photo_id": 6,
    "longitude": -97,
    "latitude": 34
  },
  {
    "photo_id": 7,
    "longitude": -97,
    "latitude": 34
  },
  {
    "photo_id": 8,
    "longitude": -99.5,
    "latitude": 34.5
  },
  {
    "photo_id": 9,
    "longitude": -100.5,
    "latitude": 35.5
  },
  {
    "photo_id": 10,
    "longitude": -103,
    "latitude": 35
  },
  {
    "photo_id": 11,
    "longitude": -103,
    "latitude": 34
  },
  {
    "photo_id": 12,
    "longitude": -100,
    "latitude": 33.5
  },
  {
    "photo_id": 13,
    "longitude": -93,
    "latitude": 30.5
  }
  ]
};
  	this.setState({ markers: data_photo.photos })



    }
  })
)(props =>
  <GoogleMap
    defaultZoom={5}
    defaultCenter={{ lat: 30.2671500, lng: -97.7430600 }}>
    <MarkerClusterer
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
      {props.markers.map(marker => (
        <Marker
          key={marker.photo_id}
          position={{ lat: marker.latitude, lng: marker.longitude }}
        />
      ))}
    </MarkerClusterer>
  </GoogleMap>
);


const PageHeader = () => (
  <Head className="pageheader">
    <title>ResCall</title>
    <meta charSet='utf-8' />
    <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    <script src="https://satori-a.akamaihd.net/satori-rtm-sdk/v1.1.1/sdk.min.js"></script>
    

  </Head>
)

const initializeRTM = (dispatcher) => {
  const rtm = new RTM('wss://og3ayb2g.api.satori.com', 'D364dDfea10C2F3eede8e5DE92e3A88B')
  const channel = rtm.subscribe(
    'disrupt',
    RTM.SubscriptionMode.SIMPLE,
     {
      filter: 'SELECT * FROM `disrupt` WHERE `type` = "dashboard" '
    }
  )

  channel.on('rtm/subscription/data', pdu => {
    pdu.body.messages.forEach(msg => {
      dispatcher(msg)
    })
  })

  rtm.on('data', pdu => {
    if (pdu.action.endsWith('/error')) {
      rtm.restart()
    }
  })

  rtm.start()

  return { rtm }
}

export default class Index extends React.Component{
	state = {
		"type": "dashboard",
		"totals": [
			{
			"name": "Water",
			"value": 100,
			"measureUnit": "Gal"
			},
			{
			"name": "Food",
			"value": 245,
			"measureUnit": "Lb"
			},
			{
			"name": "Shelter Beds",
			"value": 565,
			"measureUnit": "Beds"
			}
			],
		"Donations": {
			"total": 230,
			"list": [
				{
				"from": "+1(786)332-8464",
				"resource": "water",
				"quantity": 10,
				"measureUnit": "gallons"
				},
				{
				"from": "+1(786)332-8464",
				"resource": "food",
				"quantity": 20,
				"measureUnit": "pounds"
				}
			]
			},
		"Needs": {
			"total": 690,
			"list": [
				{
				"from": "+1(786)469-0827",
				"resource": "water",
				"quantity": 2,
				"measureUnit": "gallons"
				},
				{
				"from": "+1(267)393-9834",
				"resource": "bed",
				"quantity": 2,
				"measureUnit": "beds"
				}
		]
		}
		}
	componentDidMount () {

    console.log('Initializing RTM')
    const satori = initializeRTM(this.satoriDispatcher)
    this.setState({satori})
  }

  componentWillUnmount () {
    this.state.satori.rtm.stop()
  }

  satoriDispatcher = data => {
    console.log(data)

    this.setState({data})
  }

	render(){
		return (
			
			<div>
				<PageHeader/>

				<div className="header">
			    <h1>ResCall : +1(234)567-8910</h1>
			    <h4>Help Each Other During Catastrophes</h4>
			    </div>

		    	<div>
			    	<div className="totals">
			    	<h2> Total resources </h2>
			    	<ul className="total_list">
				    	<li> {JSON.stringify(this.state.totals[0].name)} : {JSON.stringify(this.state.totals[0].value)} {JSON.stringify(this.state.totals[0].measureUnit)} </li>
				    	<li> {JSON.stringify(this.state.totals[1].name)} : {JSON.stringify(this.state.totals[1].value)} {JSON.stringify(this.state.totals[1].measureUnit)} </li>
				    	<li> {JSON.stringify(this.state.totals[2].name)} : {JSON.stringify(this.state.totals[2].value)} {JSON.stringify(this.state.totals[2].measureUnit)} </li>
			    	</ul>
			    	</div>
			    	<br/>
			    	<div className="donations">
			    	<h2> Donations </h2>
			    	<h3> Total: {JSON.stringify(this.state.Donations.total)}</h3>
			    	<ul>
			    		<li> {JSON.stringify(this.state.Donations.list[0].quantity)} {JSON.stringify(this.state.Donations.list[0].measureUnit)} of {JSON.stringify(this.state.Donations.list[0].resource)} from{JSON.stringify(this.state.Donations.list[0].from)} </li>
						<li> {JSON.stringify(this.state.Donations.list[1].quantity)} {JSON.stringify(this.state.Donations.list[1].measureUnit)} of {JSON.stringify(this.state.Donations.list[1].resource)} from{JSON.stringify(this.state.Donations.list[1].from)} </li>
			    	</ul>
			    	</div>
			    	<br/>
			    	<div className="needs">
			    	<h2> Needs </h2>
			    	<h3> Total: {JSON.stringify(this.state.Needs.total)}</h3>
			    	<ul>
			    		<li> {JSON.stringify(this.state.Needs.list[0].quantity)} {JSON.stringify(this.state.Needs.list[0].measureUnit)} of {JSON.stringify(this.state.Needs.list[0].resource)} from{JSON.stringify(this.state.Needs.list[0].from)} </li>
						<li> {JSON.stringify(this.state.Needs.list[1].quantity)} {JSON.stringify(this.state.Needs.list[1].measureUnit)} of {JSON.stringify(this.state.Needs.list[1].resource)} from{JSON.stringify(this.state.Needs.list[1].from)} </li>
			    	</ul>
			    	</div>
			    </div>

			    <div className="map">
			    <h3> Real Time Map </h3>
			    <MapWithAMarkerClusterer className="map"/>
			    </div>

			    <div className="footer">
			    ResCall, All rights reserved. ------------ Build with Nexmo, Accenture, Amazon web services, Satori @TechcrunchDisrupt2017 !
			    </div>


			<style dangerouslySetInnerHTML={{__html: `
				 @media (max-width: 600px) {
				    .column.side, .column.middle {
				        width: 100%;
				    }}
				.body {
				    margin: 0;
				}
			  .header{
			  		font-family: 'Abel';
			  		font-size : 18px;
				  	background-color: #FFC99B;
				  	border: 1px solid black;
				  	text-align: center;
				  	line-height: 0.7;
				  	position: absolute;
				    top: 0px;
				    right: 0px;
				    padding-left: 90px;
				    width: 1280px;
				    height: 100px;
				    border: 1px solid black;
				    border: 1px solid black;
			  }
		      .totals {
		      		background-color: #FFD1AA;
				    border: 1px solid black;
				    text-align: center;
				    position: absolute;
				    top: 100px;
				    right: 900px;
				    width: 380px;
				    height: 575px;
				    border: 1px solid black;
				}

			  .total_list{
			  		line-height: 4.7;
			  		font-size:17px;
			  }

		      .donations {
			      	background-color: #F9E1CC;
				    position: absolute;
				    text-align:center;
				    top: 100px;
				    right: 450px;
				    width: 450px;
				    height: 250px;
				    border: 1px solid black;
			    }
		      .needs {
			      	background-color: #F9E1CC;
			      	text-align: center;		      	
				    position: absolute;
				    top: 100px;
				    right: 0px;
				    width: 450px;
				    height: 250px;
				    border: 1px solid black;
			    	}

			    .map {
			    	background-color: #FFD1AA;
			    	position: absolute;
				    top: 350px;
				    right: 0px;
				    width: 900px;
				    height: 300px;
				    border: 1px solid black;
				    text-align: center;

			    }
			    .footer {
			      	background-color: #F9E9CC;
			      	text-align: center;		      	
				    position: absolute;
				    padding-left: 80px;
				    padding-top: 20px;
				    top: 675px;
				    right: 0px;
				    width: 1275px;
				    height: 50px;
				    border: 1px solid black;
			    	}
		     
		    	
		    `}} />
			</div>


			)

	}
}