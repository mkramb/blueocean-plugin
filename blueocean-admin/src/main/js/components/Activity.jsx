import React, { Component, PropTypes } from 'react';
import AjaxHoc from '../AjaxHoc';
import Table from './Table';
import Runs from './Runs';

import { activityRecord, changeSetRecord } from './records';

import { components } from '@jenkins-cd/design-language';
const { Page, PageHeader, Title, WeatherIcon } = components;

export class Activities extends Component {
    render() {
        const { pipeline, data, back } = this.props;

        if (!data || !pipeline) {
            return null;
        }
        const
          {
          name,
          weatherScore,
        } = pipeline;
        const headers = ['Status', 'Build', 'Commit', 'Branch', 'Message', 'Duration', 'Completed'];

        let latestRecord = {};

        return (<Page>

            <PageHeader>
                <Title><WeatherIcon score={weatherScore} /> CloudBees / {name}</Title>
            </PageHeader>

            <main>
                <article>
                    <Table headers={headers}>
                        { data.map((run, index) => {
                            let
                            changeset = run.get('changeSet');
                            if (changeset.size > 0) {
                                changeset = changeset.toJS();
                                latestRecord = new changeSetRecord(
                                    changeset[Object.keys(changeset)[0]]);
                            }
                            return (<Runs
                              key={index}
                              changeset={latestRecord}
                              data={new activityRecord(run)}
                            />);
                        })}

                        <tr>
                            <td colSpan={headers.length}>
                                <button onClick={back}>Dashboard</button>
                            </td>
                        </tr>
                    </Table>
                </article>
            </main>
          </Page>);
    }
}

Activities.propTypes = {
    pipeline: PropTypes.object.isRequired,
    back: PropTypes.func.isRequired,
    data: PropTypes.object,
};

const baseUrl = '/jenkins/blue/rest/organizations/jenkins/pipelines/';

export default AjaxHoc(Activities, props => ({
    url: `${baseUrl}${props.pipeline.name}/runs`,
}));
