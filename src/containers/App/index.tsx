import * as React from 'react';

import './style.css';

import pptIcon from '../../assets/iconppt.png';

import { Header, Timeline } from '../../components';

interface indexState {
	projectName: string;
	fileName: string;
	userName: string;
	showAllProjects: boolean;
}
export class App extends React.Component<{}, indexState> {
	constructor(props) {
		super(props);
		this.state = {
			projectName: null,
			fileName: null,
			userName: null,
			showAllProjects: false
		};
	}
	changeFileName(fileName) {
		this.setState({
			fileName: fileName,
			userName: null,
			projectName: null,
			showAllProjects: false
		});
	}
	changeProjectName(projectName) {
		this.setState({
			fileName: null,
			userName: null,
			projectName: projectName,
			showAllProjects: false
		});
	}
	changeUserName(userName) {
		this.setState({
			fileName: null,
			userName: userName,
			projectName: null,
			showAllProjects: false
		});
	}
	showAllProjects(isShow) {
		this.setState({
			showAllProjects: isShow
		});
	}
	render() {
		return (
			<div>
				<Header
					fileName={this.state.fileName}
					projectName={this.state.projectName}
					userName={this.state.userName}
					showAllProjects={this.showAllProjects.bind(this)}
				/>
				<Timeline
					changeFileName={this.changeFileName.bind(this)}
					changeProjectName={this.changeProjectName.bind(this)}
					changeUserName={this.changeUserName.bind(this)}
					showAllProjects={this.state.showAllProjects}
				/>
			</div>
		);
	}
}
