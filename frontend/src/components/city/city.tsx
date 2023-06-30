import { memo } from 'react';

import type { CityName } from '../../types/types';

type CityProps = {
  name: CityName;
  isActive: boolean;
  onClick: (name: CityName) => void;
};

const City = ({ name, isActive, onClick }: CityProps): JSX.Element => {
  const handleCityClick = () => {
    onClick(name);
  };

  return (
    <li className="locations__item">
      <button
        className={`locations__item-link tabs__item ${isActive ? 'tabs__item--active' : ''}`}
        onClick={handleCityClick}
        tabIndex={0}
      >
        <span>{name}</span>
      </button>
    </li>
  );
};

export default memo(City);
