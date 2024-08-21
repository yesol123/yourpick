import { useEffect, useState } from 'react';
import './App.css';
const { kakao } = window;

function App() {
  const [activeType, setActiveType] = useState(null); // 선택된 타입을 저장하는 state

  const changeMaker = (type) => {
    setActiveType(type); // 클릭된 타입을 저장
    console.log(type);
  };

  const markerImages = {
    FOOD: '/food.png',
    MART: '/mart.png',
    CAFE: '/cafe.png',
    PHARMACY: '/pharmacy.png'
  };

  useEffect(() => {
    // 지도를 생성합니다
    const container = document.getElementById('map'); // 지도 담는 DOM 레퍼런스
    const options = {
      center: new kakao.maps.LatLng(37.5358994, 126.8969627),
      level: 3
    };
    const map = new kakao.maps.Map(container, options);

    const defaultMarkerPosition = new kakao.maps.LatLng(37.5358994, 126.8969627);
    const defaultMarker = new kakao.maps.Marker({
      position: defaultMarkerPosition,
    });
    defaultMarker.setMap(map);

    let markers = []; // 생성된 마커들을 저장할 배열

    // API에서 마커 데이터를 가져옵니다
    fetch('https://apiy.yourpick.co.kr/mission/test001')
      .then(response => response.json())
      .then(data => {
        // 기존 마커 제거
        markers.forEach(marker => marker.setMap(null));
        markers = [];

        // 마커를 필터링하여 지도에 추가합니다
        data.forEach(location => {
          if (!activeType || location.type === activeType) { // 선택된 타입과 일치하는 경우에만 마커 표시
            const markerPosition = new kakao.maps.LatLng(location.lat, location.lng);
            const markerImage = new kakao.maps.MarkerImage(
              markerImages[location.type],
              new kakao.maps.Size(25, 25),
              { offset: new kakao.maps.Point(27, 69) }
            );

            const marker = new kakao.maps.Marker({
              position: markerPosition,
              image: markerImage
            });
            marker.setMap(map);
            markers.push(marker); // 마커를 배열에 저장
          }
        });
      });

  }, [activeType]); // activeType이 변경될 때마다 실행

  return (
    <section className="App">
      <h1>hi!</h1>
      <article id='map' className='map_area'></article>
      <div className='buttons'>
        <button onClick={() => changeMaker('FOOD')}><img src={markerImages.FOOD} alt="음식점" /><p>음식점</p></button>
        <button onClick={() => changeMaker('MART')}><img src={markerImages.MART} alt="편의점" /><p>편의점</p></button>
        <button onClick={() => changeMaker('CAFE')}><img src={markerImages.CAFE} alt="카페" /><p>카페</p></button>
        <button onClick={() => changeMaker('PHARMACY')}><img src={markerImages.PHARMACY} alt="약국" /><p>약국</p></button>
      </div>
    </section>
  );
}

export default App;