import * as React from 'react';

import * as s from './style.css';

import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';

/*
  TODO: Please, do not forget that path can be:
  - Home
  - Home / Project name
  - Home / Project name / File name
  or
  - Home / User name
*/
interface headerProps {
	projectName: string;
	fileName: string;
	userName: string;
	showAllProjects?: any;
}
interface headerState {
	projectName: string;
	fileName: string;
	userName: string;
}
export class Header extends React.Component<headerProps, headerState> {
	constructor(props) {
		super(props);
		this.state = {
			fileName: '',
			userName: '',
			projectName: ''
		};
	}
	componentWillReceiveProps(newProps) {
		if (
			newProps.fileName !== this.props.fileName ||
			newProps.projectName !== this.props.projectName ||
			newProps.userName !== this.props.userName
		) {
			this.setState({
				userName: newProps.userName,
				fileName: newProps.fileName,
				projectName: newProps.projectName
			});
		}
	}
	showAllProjects() {
		this.props.showAllProjects(true);
		this.setState({
			fileName: '',
			userName: '',
			projectName: ''
		});
	}
	render() {
		const { projectName, fileName, userName } = this.state;
		return (
			<header className={s.header}>
				<SearchBox />
				<div className={s.breadcrumbs}>
					<a className={s.link} href="#" onClick={this.showAllProjects.bind(this)}>
						All projects
					</a>
					{projectName && <span className={s.separator}>/</span>}
					<a className={s.link} href="#" onClick={() => alert('Redirect to project page')}>
						{projectName}
					</a>
				</div>
				<h1 className={s.projectname}>
					{fileName} {userName}
				</h1>
			</header>
		);
	}
}
