import React, { Component } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export default class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mutatedList: []
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.sortField !== prevProps.sortField) {
            this.arrangeList();
            console.log("changing sortfield")
        }
        if (this.props.restaurants !== prevProps.restaurants) {
            this.setState({ mutatedList: this.props.restaurants })
            console.log("changing data")
        }
    }

    arrangeList = () => {
        let field = this.props.sortField;
        if (field === "Prominence") {
            this.setState({ mutatedList: this.props.restaurants });
        }
        else if (field === "Open Now") {
            this.setState({ mutatedList: this.props.restaurants.filter(place => place.opening_hours != null && place.opening_hours.open_now) })
        }
        else {
            let sortFunc;
            switch (field) {
                case "Price (Lowest to Highest)":
                    sortFunc = (place, place2) => {
                        // console.log("sorting")
                        let price1 = parseInt(place.price_level) || 1000;
                        let price2 = parseInt(place2.price_level) || 1000
                        // console.log(i + " " + i2);
                        return price1 - price2 // low price first
                    }
                    break;
                case "Price (Highest to Lowest)":
                    sortFunc = (place, place2) => {
                        // console.log("sorting")
                        let price1 = parseInt(place.price_level) || -10;
                        let price2 = parseInt(place2.price_level) || -10;
                        // console.log(i + " " + i2);
                        return -(price1 - price2) // high price first
                    }
                    break;
                case "Rating":
                    sortFunc = (place, place2) => {
                        let rating1 = parseFloat(place.rating) || -10;
                        let rating2 = parseFloat(place2.rating) || -10;
                        return -(rating1 - rating2); // highest comes first
                    }
                    break;
                default:
                    console.log("no sort possible")
            }
            this.setState({ mutatedList: this.props.restaurants.slice().sort(sortFunc) });
        }
    }
    render() {
        let count = 0;
        return <div className="list" style={{ textAlign: "left" }}>
            <Accordion activeKey={this.props.displayRestaurantIndex != null ? this.props.displayRestaurantIndex.toString() : null}>
                {this.state.mutatedList.map(restaurant => {
                    return (
                        <Card key={restaurant.id}>
                            <Card.Header>
                                <Accordion.Toggle 
                                as={Button} 
                                variant="link" 
                                eventKey={this.props.restaurants.indexOf(restaurant).toString()}
                                onClick={(e) => {this.props.setDisplayIndex(this.props.restaurants.indexOf(restaurant))}}
                                >
                                    {restaurant.name} {restaurant.price_level != null ? "- " + "$".repeat(restaurant.price_level) : ""}
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey={this.props.restaurants.indexOf(restaurant).toString()}>
                                <Card.Body>
                                    Rating - {restaurant.rating}
                                    <br />Location - {restaurant.vicinity}
                                    <br />{(restaurant.opening_hours !== null && restaurant.opening_hours !== undefined) ?
                                        restaurant.opening_hours ? "Open now" : "Currently closed" : ""}
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    )
                })}
            </Accordion>
        </div>
    }
}