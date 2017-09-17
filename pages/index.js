
import React from "react"
import Head from 'next/head'

import fetch from "isomorphic-fetch"
import { compose, withProps, lifecycle } from "recompose"
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps"

import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer"
import geo_data from './geo_data.json'
import Total from "../components/Total";
import UserItem from "../components/UserItem";



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
      //     this.setState({ markers: data.photos })
      //   })

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
      }
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
)


const PageHeader = () => (
  <Head className="pageheader">
    <title>ResCall</title>
    <meta charSet='utf-8' />
    <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    <script src="https://satori-a.akamaihd.net/satori-rtm-sdk/v1.1.1/sdk.min.js"></script>
    <script src="https://use.fontawesome.com/eb1059f449.js"></script>
  </Head>
)

const initializeRTM = (dispatcher) => {
  const rtm = new RTM('wss://og3ayb2g.api.satori.com', 'D364dDfea10C2F3eede8e5DE92e3A88B')
  const channel = rtm.subscribe(
    'disrupt2017',
    RTM.SubscriptionMode.SIMPLE,
    {
      filter: 'SELECT * FROM `disrupt2017` WHERE `type` = "dashboard" '
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
  state = {dashboard: null, satori: null}

  componentDidMount () {
    console.log('Initializing RTM')
    const satori = initializeRTM(this.satoriDispatcher)
    this.setState({satori})
  }

  componentWillUnmount () {
    if (this.state.satori) {
      this.state.satori.rtm.stop()
    }
  }

  satoriDispatcher = data => {
    console.log(data)
    this.setState({dashboard: data})
  }

  render(){
    const { dashboard } = this.state
    //
    if (!dashboard) {
      return (
        <div>
          <PageHeader/>Loading
        </div>
      )
    }

    return (
      <div className='Screen'>
        <PageHeader/>

        <div className="header">
          <h1>ResCall +1 (201) 644-4271</h1>
          <h4>Help Each Other During Catastrophes</h4>
        </div>

        <div className='header-bottom'>
          <div className="totals">
            {dashboard.totals.map(total => (
              <Total total={total} key={total.name}/>
            ))}
          </div>

          <div className='donations'>
            <div className='users'>
              <div className='list'>
                <div className='listHeader'>{dashboard.Donations.total} Donations</div>
                {dashboard.Donations.list.map((donation, index) => (
                  <UserItem intent={donation} first={index === 0} key={index}/>
                ))}
              </div>
              <div className='list'>
                <div className='listHeader'>{dashboard.Needs.total} Needs</div>
                {dashboard.Needs.list.map((needs, index) => (
                  <UserItem intent={needs}  first={index === 0} key={index}/>
                ))}
              </div>
            </div>

            <div className="map">
              <MapWithAMarkerClusterer className='mapComponent'/>
            </div>
          </div>


        </div>

        <div className="footer">
          ResCall, All rights reserved. ------------ Build with Nexmo, Accenture, Amazon web services, Satori @TechcrunchDisrupt2017 !
        </div>


        {/*language=CSS*/}
        <style jsx>{`
          .Screen {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            background-color: aquamarine;
            font-family: "Helvetica Neue", Arial, sans-serif;
          }

          .header {
            display: inline-flex;
            flex-basis: 100px;
            flex-shrink: 0;
            background-color: antiquewhite;
            justify-content: center;
            flex-direction: column;
          }

          .header h1, .header h4 {
            text-align: center;
            margin: 0;
            padding: 0;
          }

          .header-bottom {
            display: inline-flex;
            flex-grow: 1;
            flex-direction: row;
          }

          .footer {
            display: inline-flex;
            flex-basis: 50px;
            flex-shrink: 0;
            background-color: antiquewhite;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            font-weight: 500;
          }

          .totals {
            display: inline-flex;
            flex-direction: column;
            background-color: white;
            flex-basis: 30%;
            flex-shrink: 0;
          }

          .donations {
            display: flex;
            flex-direction: column;
            width: 100%;
          }

          .users {
            display: flex;
            width: 100%;
            flex-direction: row;
            flex-grow: 1;
            background-color: aliceblue;
          }

          .list {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            border-right: solid 1px #ccc;
            overflow: auto;
          }

          .list .listHeader {
            display: inline-flex;
            flex-direction: column;
            flex-basis: 40px;
            background-color: rgba(215, 221, 225, 0.95);
            font-size: 25px;
            justify-content: center;
            align-items: center;
            flex-shrink: 0;
          }

          .map {
            display: flex;
            width: 100%;
            background-color: aliceblue;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          .mapComponent {
            display: flex;
            width: 100%;
            flex-grow: 1;
          }

        `}</style>
      </div>


    )

  }
}
