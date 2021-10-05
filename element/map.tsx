import * as d3 from 'd3';
import { useEffect, useState } from 'react';

type MapFragmentProps = {
  data?: d3.ExtendedFeatureCollection<
    d3.ExtendedFeature<d3.GeoGeometryObjects | null, any>
  >;
};

const MapFragment = ({ data }: MapFragmentProps): JSX.Element => {
  const [g, setG] =
    useState<d3.Selection<d3.BaseType, unknown, HTMLElement, any>>();
  const [svgNode, setSvgNode] = useState<Element>();
  const [subscribe, setSubscribe] = useState<boolean>(false);

  useEffect(() => {
    const svg = d3.select('#floodMap');
    setG(svg.select('g'));
    setSvgNode(svg.node()! as Element);
  }, []);

  useEffect(() => {
    if (!g || !svgNode || !data || subscribe) return;

    renderMap();
    window.addEventListener('resize', () => renderMap());
    setSubscribe(true);
  }, [g, data]);

  const renderMap = () => {
    if (!g || !svgNode || !data) return;

    const width = svgNode.getBoundingClientRect().width;
    const height = svgNode.getBoundingClientRect().height;

    const projection = d3
      .geoMercator()
      .rotate([-180, 0])
      .fitSize([width, height], data);
    const path = d3.geoPath().projection(projection);

    g.selectChildren().remove();

    g.selectAll('path')
      .data(data.features)
      .enter()
      .append('path')
      .attr('d', path)
      .style('fill', (val) => val.properties.color)
      .style('cursor', 'pointer')
      .on('mouseover', (e) => {
        d3.select(e.currentTarget).style('fill', `rgb(200,200,200)`);
      })
      .on('mouseout', (e) => {
        d3.select(e.currentTarget).style(
          'fill',
          (val: any) => val.properties.color
        );
      })
      .on('click', (_, d) => {
        console.info(d.properties.name);
      });
  };

  return (
    <svg id="floodMap" width="100%" height="100%">
      <g></g>
    </svg>
  );
};

export default MapFragment;
