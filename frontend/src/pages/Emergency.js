import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Emergency = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const emergencyNumbers = [
    { name: 'National Emergency', number: '112', description: 'All Emergency Services (Fire, Police, Medical)', color: 'bg-red-600 hover:bg-red-700' },
    { name: 'Fire Department', number: '101', description: 'Fire Emergency Services', color: 'bg-orange-600 hover:bg-orange-700' },
    { name: 'Ambulance', number: '102', description: 'Medical Emergency Services', color: 'bg-green-600 hover:bg-green-700' },
    { name: 'Police Emergency', number: '100', description: 'Police Emergency Helpline', color: 'bg-blue-600 hover:bg-blue-700' },
    { name: 'Emergency Response', number: '108', description: 'State Emergency Response Services', color: 'bg-purple-600 hover:bg-purple-700' },
    { name: 'Women Helpline', number: '1091', description: 'Women in Distress Helpline', color: 'bg-pink-600 hover:bg-pink-700' }
  ];

  const emergencyTypes = [
    {
      name: 'Fire',
      icon: '🔥',
      color: 'bg-red-50 border-red-200 text-red-800',
      actions: ['Call 911', 'Evacuate immediately', 'Stay low to avoid smoke', 'Meet at family meeting point']
    },
    {
      name: 'Earthquake',
      icon: '🌍',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      actions: ['Drop, Cover, Hold On', 'Stay away from windows', 'Do not run outside during shaking', 'Check for injuries after']
    },
    {
      name: 'Flood',
      icon: '🌊',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      actions: ['Move to higher ground', 'Avoid walking in moving water', 'Turn off utilities', 'Do not drive through flooded roads']
    },
    {
      name: 'Power Outage',
      icon: '⚡',
      color: 'bg-gray-50 border-gray-200 text-gray-800',
      actions: ['Use flashlights, not candles', 'Keep refrigerator closed', 'Unplug electronic devices', 'Stay hydrated']
    },
    {
      name: 'Medical Emergency',
      icon: '🏥',
      color: 'bg-green-50 border-green-200 text-green-800',
      actions: ['Call 911', 'Keep patient calm', 'Apply first aid if trained', 'Do not move injured person unless necessary']
    },
    {
      name: 'Severe Weather',
      icon: '🌪️',
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      actions: ['Monitor weather alerts', 'Secure outdoor items', 'Stay indoors', 'Have emergency kit ready']
    }
  ];

  const getLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude.toFixed(6),
            lng: position.coords.longitude.toFixed(6)
          });
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationLoading(false);
          alert('Unable to get your location. Please ensure location services are enabled.');
        }
      );
    } else {
      setLocationLoading(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  const copyLocation = () => {
    if (currentLocation) {
      const locationText = `My current location: ${currentLocation.lat}, ${currentLocation.lng}`;
      navigator.clipboard.writeText(locationText).then(() => {
        alert('Location copied to clipboard!');
      });
    }
  };

  const shareLocation = () => {
    if (currentLocation) {
      const locationUrl = `https://maps.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`;
      if (navigator.share) {
        navigator.share({
          title: 'My Emergency Location',
          text: `I need help at this location: ${currentLocation.lat}, ${currentLocation.lng}`,
          url: locationUrl
        });
      } else {
        window.open(`mailto:?subject=Emergency Location&body=I need help at this location: ${locationUrl}`);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-red-700 mb-4">
          🚨 Emergency Dashboard
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Quick access to emergency contacts, immediate action guides, and critical tools for emergency situations.
        </p>
      </div>

      {/* Emergency Alert Banner */}
      <div className="bg-red-600 text-white rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">⚠️</div>
            <div>
              <h2 className="text-xl font-bold mb-1">In Case of Immediate Emergency</h2>
              <p className="text-red-100">Always call 112 first for life-threatening situations in India</p>
            </div>
          </div>
          <a
            href="tel:112"
            className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Call 112
          </a>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {emergencyNumbers.map((contact, index) => (
          <a
            key={index}
            href={`tel:${contact.number}`}
            className={`${contact.color} text-white rounded-lg p-6 text-center transition-colors block`}
          >
            <div className="text-2xl font-bold mb-2">{contact.number}</div>
            <div className="text-lg font-semibold mb-1">{contact.name}</div>
            <div className="text-sm opacity-90">{contact.description}</div>
          </a>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Location Services */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📍 Emergency Location</h2>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              Share your current location with emergency responders or family members.
            </p>
            
            <button
              onClick={getLocation}
              disabled={locationLoading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {locationLoading ? 'Getting Location...' : 'Get Current Location'}
            </button>

            {currentLocation && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Your Current Location:</h3>
                <div className="text-sm text-blue-600 font-mono mb-4">
                  Latitude: {currentLocation.lat}<br />
                  Longitude: {currentLocation.lng}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={copyLocation}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Copy Location
                  </button>
                  <button
                    onClick={shareLocation}
                    className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Share Location
                  </button>
                  <a
                    href={`https://maps.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
                  >
                    View on Map
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Kit Checklist */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🧳 Emergency Kit Status</h2>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input type="checkbox" id="water" className="w-4 h-4 text-blue-600" />
              <label htmlFor="water" className="text-gray-900">Water (1 gallon per person per day, 3-day supply)</label>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" id="food" className="w-4 h-4 text-blue-600" />
              <label htmlFor="food" className="text-gray-900">Non-perishable food (3-day supply)</label>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" id="flashlight" className="w-4 h-4 text-blue-600" />
              <label htmlFor="flashlight" className="text-gray-900">Flashlight and extra batteries</label>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" id="radio" className="w-4 h-4 text-blue-600" />
              <label htmlFor="radio" className="text-gray-900">Battery-powered or hand crank radio</label>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" id="first-aid" className="w-4 h-4 text-blue-600" />
              <label htmlFor="first-aid" className="text-gray-900">First aid kit</label>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" id="medications" className="w-4 h-4 text-blue-600" />
              <label htmlFor="medications" className="text-gray-900">Medications and medical supplies</label>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" id="documents" className="w-4 h-4 text-blue-600" />
              <label htmlFor="documents" className="text-gray-900">Important documents (copies)</label>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" id="cash" className="w-4 h-4 text-blue-600" />
              <label htmlFor="cash" className="text-gray-900">Cash and credit cards</label>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <Link
              to="/resources"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              📚 View complete emergency kit guide →
            </Link>
          </div>
        </div>
      </div>

      {/* Emergency Action Guides */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          ⚡ Quick Action Guides
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emergencyTypes.map((emergency, index) => (
            <div
              key={index}
              className={`rounded-lg border-2 p-6 ${emergency.color}`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-3xl">{emergency.icon}</div>
                <h3 className="text-xl font-bold">{emergency.name}</h3>
              </div>
              
              <div className="space-y-2">
                {emergency.actions.map((action, actionIndex) => (
                  <div key={actionIndex} className="flex items-start space-x-2">
                    <span className="text-sm font-bold mt-0.5">{actionIndex + 1}.</span>
                    <span className="text-sm">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
          🔗 Additional Emergency Resources
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/resources"
            className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold text-gray-900 mb-2">Emergency Guides</h3>
            <p className="text-sm text-gray-600">Detailed preparedness resources and training materials</p>
          </Link>
          
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold text-gray-900 mb-2">Mobile Mesh App</h3>
            <p className="text-sm text-gray-600">Offline communication when networks are down</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="font-semibold text-gray-900 mb-2">Weather Alerts</h3>
            <p className="text-sm text-gray-600">Stay informed about weather conditions and warnings</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <div className="text-yellow-600 text-xl">⚠️</div>
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
            <p className="text-yellow-700 text-sm">
              This app is designed to supplement, not replace, official emergency services and preparedness training. 
              Always follow official guidance from NDMA (National Disaster Management Authority) and local emergency management authorities. 
              In life-threatening emergencies, call 112 immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
