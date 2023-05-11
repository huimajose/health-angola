import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoid2lkc29uIiwiYSI6ImNrbXZyZHlpdjA3dWYycHFzcTF6Z2txYTgifQ.dfzOBZeGLBKSD6lLW8uwPA';
    

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [17.8739, -11.2027],
      zoom: 5
    });

    map.on('load', () => {
      
      map.addSource('earthquakes', {
      'type': 'geojson',
        "data": 'http://localhost:4000/api/v1/sanitario'
         ,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      });

   

        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'earthquakes',
          filter: ['has', 'point_count'],
          paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',
          100,
          '#f1f075',
          750,
          '#f28cb1'
          ],
          'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,
          100,
          30,
          750,
          40
          ]
          }
          });
           
          map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'earthquakes',
          filter: ['has', 'point_count'],
          layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
          }
          });
           
          map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'earthquakes',
          filter: ['!', ['has', 'point_count']],
          paint: {
          'circle-color': '#11b4da',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
          }
          });
           
          // inspect a cluster on click
          map.on('click', 'clusters', (e) => {
          const features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
          });
          const clusterId = features[0].properties.cluster_id;
          map.getSource('earthquakes').getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
          if (err) return;
           
          map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom
          });
          }
          );
          });
           
          // When a click event occurs on a feature in
          // the unclustered-point layer, open a popup at
          // the location of the feature, with
          // description HTML from its properties.
          map.on('click', 'unclustered-point', (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const mortes = e.features[0].properties.mortes_confirmadas;
          const casos = e.features[0].properties.casos_confirmados;
          //e.features[0].properties.mortes === 1 ? 'yes' : 'no';
          const situacao = e.features[0].properties.situacao;
          const allergyName = e.features[0].properties.allergyName;
          const provincia = e.features[0].properties.provincia;
          const capital = e.features[0].properties.capital;
          const population = e.features[0].properties.population;
          const area = e.features[0].properties.area;
           
          // Ensure that if the map is zoomed out such that
          // multiple copies of the feature are visible, the
          // popup appears over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
           
          new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(
          `<b>${provincia}</b><br> ${capital}<br>População: ${population}<br>Área total: ${area}<br><b>${allergyName} </b><br>Casos: ${casos}<br>Mortes: ${mortes}<br>Situação?: ${situacao}`
          )
          .addTo(map);
          });
           
          map.on('mouseenter', 'clusters', () => {
          map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'clusters', () => {
          map.getCanvas().style.cursor = '';
          });
        
        });

  },
  
  
  
  
  []);

  

  return (
    <div id="map" style={{ width: '100%', height: '100vh' }}></div>
  );
}

export default App;
