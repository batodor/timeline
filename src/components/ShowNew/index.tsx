import * as React from 'react';

import * as ItemCss from '../../assets/item.css';
import * as css from './style.css';
import * as API from '../../API';

interface showNewProps {
	showNewLink: any;
	userId: any;
	fileId: any;
	projectId: any;
	showAllProjects: any;
}
interface showNewState {
	subNum: number;
	subActs: any;
}
let subscription;

export class ShowNew extends React.Component<showNewProps, showNewState> {
	constructor(props) {
		super(props);
		this.state = {
			subNum: 0,
			subActs: []
		};
	}

	componentDidMount() {
		subscription = API.timeline.subscribe((value) => {
			let newSubNum = this.state.subNum + 1;
			value['highlight'] = true;
			let newSubActs = [ value ].concat(this.state.subActs);
			this.setState({
				subNum: newSubNum,
				subActs: newSubActs
			});
		});
	}

	componentWillReceiveProps(newProps) {
		if (
			newProps.fileId !== this.props.fileId ||
			newProps.userId !== this.props.userId ||
			newProps.projectId !== this.props.projectId ||
			newProps.showAllProjects !== this.props.showAllProjects
		) {
			subscription.unsubscribe();
			this.setState({
				subNum: 0,
				subActs: []
			});
			if (Number.isFinite(newProps.userId)) {
				subscription = API.user(newProps.userId).subscribe((value) => {
					let newSubNum = this.state.subNum + 1;
					value['highlight'] = true;
					let newSubActs = [ value ].concat(this.state.subActs);
					this.setState({
						subNum: newSubNum,
						subActs: newSubActs
					});
				});
			} else if (Number.isFinite(newProps.fileId)) {
				API.file(newProps.fileId).getActivities().then((data) => {
					// Check if there is any activities for this file
					if (data['length'] > 0) {
						subscription = API.user(newProps.fileId).subscribe((value) => {
							let newSubNum = this.state.subNum + 1;
							value['highlight'] = true;
							let newSubActs = [ value ].concat(this.state.subActs);
							this.setState({
								subNum: newSubNum,
								subActs: newSubActs
							});
						});
					}
				});
			} else if (Number.isFinite(newProps.projectId)) {
				subscription = API.project(newProps.projectId).subscribe((value) => {
					let newSubNum = this.state.subNum + 1;
					value['highlight'] = true;
					let newSubActs = [ value ].concat(this.state.subActs);
					this.setState({
						subNum: newSubNum,
						subActs: newSubActs
					});
				});
			} else if (newProps.showAllProjects) {
				subscription = API.timeline.subscribe((value) => {
					let newSubNum = this.state.subNum + 1;
					value['highlight'] = true;
					let newSubActs = [ value ].concat(this.state.subActs);
					this.setState({
						subNum: newSubNum,
						subActs: newSubActs
					});
				});
			}
		}
	}

	showNew() {
		this.props.showNewLink(this.state.subActs);
		this.setState({
			subNum: 0,
			subActs: []
		});
	}

	public render() {
		return (
			<div className={`${ItemCss.item} ${css.root}`}>
				<button className={css.button} onClick={this.showNew.bind(this)}>
					Load new {this.state.subNum} activities
				</button>
				<div className={css.line} />
			</div>
		);
	}
}
