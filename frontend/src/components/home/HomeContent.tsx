import contentStyles from '../Content.module.css';
import CategoriesList from "./CategoriesList.tsx";


const HomeContent = () => {

  return (
    <div
      className={contentStyles.content}
    >
      <CategoriesList />
    </div>
  );
}

export default HomeContent