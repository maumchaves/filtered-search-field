import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component {
  
   constructor(props) {
     super(props);
     this.state = {
       search: {
         term: '',
         filters: {}
       }
     };
   }
   
   handleTermChange(term) {
     let search = Object.assign({}, this.state.search);
     search.term = term;
     this.setState({ search: search });
   }
   
   handleFilterChange(key, value) {
     let search = Object.assign({}, this.state.search);
     search.filters[key] = value;
     this.setState({ search: search });
   }
   
   handleOnSubmit() {
     console.log(this.state.search);
   }
   
   render() {
     return (
       <div className="container">
         <div className="row">
           <Branding/>
           <div className="content">
             <FilteredSearchField
               filtersValues={this.state.search.filters}
               onTermChange={(term) => this.handleTermChange(term)}
               onFilterChange={(key, value) => this.handleFilterChange(key, value)}
               onSubmit={() => this.handleOnSubmit()}/>
             <Results results={this.state.search}/>
           </div>
         </div>
       </div>
     );
   }
 }
 
 function Results(props) {
   return <div className="results"><pre>{JSON.stringify(props.results, null, 2)}</pre></div>
 }
 
 function Branding(props) {
   const logoSrc = "./logo.png";
   return <div className="branding"><img src={logoSrc} alt=""/></div>;
 }
 
 class FilteredSearchField extends React.Component {
   
   constructor(props) {
     super(props);
     this.state = {
       showFilters: false
     };
   }
   
   handleOnClick(e) {
     e.stopPropagation();
     this.setState({showFilters: true});
   }
   
   handleOnBlur(e) {
     this.setState({showFilters: false});
   }
   
   handleOnSubmit(e) {
     if(e.which === 13 || e.keyCode === 13) {
       this.handleOnBlur(e);
       this.props.onSubmit();
     }
   }
   
   componentDidMount () {
     window.addEventListener('click', (e) => this.handleOnBlur(e), false);
   }
 
   render() {
     return (
       <div className="filtered-search" onClick={(e) => this.handleOnClick(e)}>
         <FilteredSearchInput
           onChange={(term) => this.props.onTermChange(term.target.value)}
           onSubmit={(e) => this.handleOnSubmit(e)}/>
         {this.state.showFilters && (
           <Filters
             filtersValues={this.props.filtersValues}
             onFilterChange={this.props.onFilterChange}/>
         )}
       </div>
     );
   }
   
 }
 
 function FilteredSearchInput(props) {
   return (
     <div className="input-container">
       <i className="material-icons">search</i>
       <input
         type="text" placeholder="Search items..."
         onChange={props.onChange}
         onKeyPress={props.onSubmit}/>
     </div>
   );
 }
 
 function Filters(props) {
   const filters = [
     { component: ListedFilter, filterKey: 'listedInTheLast' },
     { component: SortByFilter, filterKey: 'sortBy' },
     { component: RadiusFilter, filterKey: 'radius' },
     { component: OnlyMyCountryFilter, filterKey: 'onlyInMyCountry' },
     { component: CategoriesFilter, filterKey: 'categories' }
   ];
   return (
     <div className="filters-container">
       <h2>Filters</h2>
       <div className="filters">
         {
           filters.map((filter) =>
             React.createElement(filter.component, {
               key: filter.filterKey,
               onFilterChange: props.onFilterChange,
               filterKey: filter.filterKey,
               value: props.filtersValues[filter.filterKey]
             })
           )
         }
       </div>
     </div>
   );
 }
 
 function Filter(props) {
   return (
     <div className={props.prefixClass + "-filter filter"}>
       <FilterHeader
         icon={props.icon} title={props.title}
         showValue={props.showValue} value={props.value}
         default={props.default}/>
       {props.children}
     </div>
   );
 }
 
 function FilterHeader(props) {
   return (
     <div className="filter-header">
       <i className="material-icons">{props.icon}</i>
       <h4>{props.title}</h4>
       {props.showValue && <span>{props.value || props.default}</span>}
     </div>
   );
 }
 
 function SliderFilter(props) {
   const value = props.value || props.options[0];
   return (
     <Filter
       icon={props.icon} title={props.title} prefixClass={props.prefixClass}
       showValue={true} value={value} default={props.options[0]}>
       <input
         type="range" min="0" max={props.options.length - 1}
         className="slider" value={props.options.indexOf(value)}
         onChange={(e) => props.onFilterChange(props.filterKey, props.options[e.target.value])}/>
     </Filter>
   );
 }
 
 function ListedFilter(props) {
   const options = ['24 hours', '3 days', '7 days', '30 days', 'forever'];
   return (
     <SliderFilter
       icon="event" title="Listed in the last" prefixClass="listed" options={options}
       filterKey={props.filterKey} value={props.value} onFilterChange={props.onFilterChange}/>
   );
 }
 
 function RadiusFilter(props) {
   const options = ['1 km', '5 km', '10 km', '50 km', 'everywhere'];
   return (
     <SliderFilter
       icon="location_on" title="Radius" prefixClass="radius" options={options}
       filterKey={props.filterKey} value={props.value} onFilterChange={props.onFilterChange}/>
   );
 }
 
 function SortByFilter(props) {
   const options = ['Distance', 'Date', 'Price (asc.)', 'Price (des.)'];
   return (
     <Filter
       icon="sort" title="Sort by" prefixClass="sort">
       <select
         value={props.value}
         onChange={(e) => props.onFilterChange(props.filterKey, e.target.value)}>
         {options.map((option, i) => 
            <option value={options[i]} key={i}>{options[i]}</option>)}
       </select>
     </Filter>
   );
 }
 
 function OnlyMyCountryFilter(props) {
   return (
     <Filter
       icon="flag" title="Search only in my country" prefixClass="only-country">
       <label className="switch">
         <input type="checkbox" checked={props.value || false}
           onChange={(e) => props.onFilterChange(props.filterKey, e.target.checked)}/>
         <span className="slider-switch round"></span>
       </label>
     </Filter>
   );
 }
 
 function CategoriesFilter(props) {
   
   const options = ['New in your area', 'Electronics', 'Home and Garden', 'Services'];
   const isSelected = (category) => props.value && props.value.indexOf(category) > -1;
   
   const handleOnAdded = (category) => {
     let categories = props.value || [];
     categories.push(category);
     props.onFilterChange(props.filterKey, categories);
   }
   
   const handleOnRemoved = (category) => {
     let categories = props.value;
     categories.splice(categories.indexOf(category), 1);
     props.onFilterChange(props.filterKey, categories);
   }
   
   return (
     <Filter
       icon="label" title="Choose categories" prefixClass="categories">
       <div className="categories">
         {
           options.map((option, i) => (
             <Category
               option={option} checked={isSelected(option) || false}
               filterKey={props.filterKey} onAdded={handleOnAdded}
               onRemoved={handleOnRemoved} key={i}/>
           ))
         }
       </div>
     </Filter>
   );
 }
 
 function Category(props) {
   return (
     <div className="category">
           <span>{props.checked}</span>
       <label className="checkbox-container">{props.option}
         <input type="checkbox" checked={props.checked}
           onChange={(e) => e.target.checked ? props.onAdded(props.option) : props.onRemoved(props.option)}/>
         <span className="checkmark"></span>
       </label>
     </div>
   );
 }
 
 ReactDOM.render(<App />, document.getElementById("root"));
