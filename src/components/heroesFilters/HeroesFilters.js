import { useSelector, useDispatch } from "react-redux";
import { filtersFetching, filtersFetched, filtersFetchingError, activeFilterChanged } from '../../actions';
import { useEffect} from 'react'
import { useHttp } from "../../hooks/http.hook";
import Spinner from "../spinner/Spinner";

// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {

    const {filters, filtersLoadingStatus, activeFilter} = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const {request} = useHttp();

    // const [attr, setAttr] = useState();

    // const onFilter = (e) => {
    //     console.log(heroes);
    //     setAttr(e.target.getAttribute('data-elem'))
    //     switch (attr) {
    //         case 'all' :
    //             dispatch(addHero(heroes))
    //             // return (heroes.filter(hero => hero.element === 'earth'))
    //             break;
    //         case 'fire' :
    //             dispatch(addHero(heroes.filter(hero => hero.element === 'fire')))
    //             // return (heroes.filter(hero => hero.element === 'earth'))
    //             break;
    //         case 'water' :
    //             dispatch(addHero(heroes.filter(hero => hero.element === 'water')))
    //             break;
    //         case 'wind' :
    //             dispatch(addHero(heroes.filter(hero => hero.element === 'wind')))
    //             // return (heroes.filter(hero => hero.element === 'earth'))
    //             break;
    //         case 'earth' :
    //             dispatch(addHero(heroes.filter(hero => hero.element === 'earth')))
    //             // return (heroes.filter(hero => hero.element === 'earth'))
    //             break;
    //         default: return heroes
    //     }
    // }

    // const FiltersView = () => {
    //     return (
    //         filters.length !== 0? 
    //         filters.map((filter, i) => <button key={i} data-elem={filter.elem} onClick={(e) => onFilter(e)} className={`btn ${filter.class} ${filter.elem === attr? `active` : null}`}>{filter.elem}</button>)
    //         : null    
    //     )
    // }

    useEffect(() => {
        dispatch(filtersFetching());
        request("http://localhost:3001/filters")
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(filtersFetchingError()))
    }, []);

    if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderFilters = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Фильтры не найдены</h5>
        }

        return arr.map(({elem, className}) => {
            
            return <button 
                        key={elem} 
                        id={elem} 
                        className={elem === activeFilter? `btn ${className} active` : `btn ${className}`}
                        onClick={() => dispatch(activeFilterChanged(elem))}
                        >{elem}</button>
        })
    }
    const elements = renderFilters(filters);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {elements}
                </div>
            </div> 
        </div>
    )
}

export default HeroesFilters;