import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

class App extends React.Component {
  constructor(props) {
    super(props);
		let host = location.origin.replace(/^http/, 'ws');
		this.ws = new WebSocket(host)
    this.state = { 
			cities: [
						{ city: 'Santiago',
							iso: 'CL'
						},
						{ city: 'Zurich',
							iso: 'CH'
						},
						{ city: 'Auckland',
							iso: 'NZ'
						},
						{ city: 'Sydney',
							iso: 'AU'
						},
						{ city: 'Londres',
							iso: 'UK'
						},
						{ city: 'Georgia',
							iso: 'USA'
						} 
					]
		};
	}

  componentDidMount() {
		var that = this;
		this.ws.onmessage = (msg) => {
			let data = JSON.parse(msg.data)
			that.setState({cities: data.values})
		}
  }

  componentWillUnmount() {
		this.ws.close();
  }

  render() {
    return (
			<div>
				<h1 className="center">Proyecto API Darksky</h1>
				{this.state.cities.map((city, i) => {
				return <div key={i}>
					<h2>{ city.city } ({city.iso})</h2>
					<div>
						Hora : {city.time}
					</div>
					<div>
						Temperatura : {city.temp} °C
					</div>
				</div>;
				})}
			</div>
    );
  }
}

export default App;
