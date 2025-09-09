import React from 'react'
import MainCarousel from '../../components/HomeCarousel/MainCarousel'
import HomeSectionCarousel from '../../components/HomeSectionCarousel/HomeSectionCarousel'
import { mens_kurta } from '../../../Data/men_kurta'

const HomePage = () => {
  return (
    <div>
      <MainCarousel />
      <div className="space-y-10 py-20 flex flex-col justify-center lg:px-10 px-5">
        <HomeSectionCarousel data={mens_kurta} sectionName={"Đồ Nam"} />
        <HomeSectionCarousel data={mens_kurta} sectionName={"Đồ Nữ"} />
        <HomeSectionCarousel data={mens_kurta} sectionName={"Váy Nữ"} />
        <HomeSectionCarousel data={mens_kurta} sectionName={"Quần áo Nữ"} />
        <HomeSectionCarousel data={mens_kurta} sectionName={"Đồ nữ 2"} />
      </div>
    </div>
  );
}

export default HomePage