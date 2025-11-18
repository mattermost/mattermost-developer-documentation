import React, {Component} from 'react';

export default class ChannelRulesSettings extends Component {
    constructor(props) {
        super(props);

        let rules = {};
        try {
            if (props.value) {
                rules = JSON.parse(props.value);
            }
        } catch (e) {
            console.error('Failed to parse channel rules:', e);
        }

        this.state = {
            rules,
            newChannelId: '',
            newUserId: '',
            selectedChannel: '',
            error: '',
            success: ''
        };
    }

    handleAddRule = () => {
        const {newChannelId, newUserId, rules} = this.state;

        if (!newChannelId || !newUserId) {
            this.setState({error: 'Both Channel ID and User ID are required', success: ''});
            return;
        }

        const updatedRules = {...rules};
        if (!updatedRules[newChannelId]) {
            updatedRules[newChannelId] = [];
        }

        if (!updatedRules[newChannelId].includes(newUserId)) {
            updatedRules[newChannelId].push(newUserId);
            this.setState({
                rules: updatedRules,
                newChannelId: '',
                newUserId: '',
                error: '',
                success: 'User added successfully'
            }, () => {
                this.saveRules(updatedRules);
            });
        } else {
            this.setState({error: 'User already in whitelist', success: ''});
        }
    }

    handleRemoveUser = (channelId, userId) => {
        const {rules} = this.state;
        const updatedRules = {...rules};

        if (updatedRules[channelId]) {
            updatedRules[channelId] = updatedRules[channelId].filter(id => id !== userId);

            if (updatedRules[channelId].length === 0) {
                delete updatedRules[channelId];
            }

            this.setState({
                rules: updatedRules,
                error: '',
                success: 'User removed successfully'
            }, () => {
                this.saveRules(updatedRules);
            });
        }
    }

    handleRemoveChannel = (channelId) => {
        const {rules} = this.state;
        const updatedRules = {...rules};
        delete updatedRules[channelId];

        this.setState({
            rules: updatedRules,
            error: '',
            success: 'Channel removed successfully'
        }, () => {
            this.saveRules(updatedRules);
        });
    }

    saveRules = (rules) => {
        const rulesJson = JSON.stringify(rules);
        if (this.props.onChange) {
            this.props.onChange(this.props.id, rulesJson);
        }
    }

    render() {
        const {rules, newChannelId, newUserId, error, success} = this.state;
        const {helpText} = this.props;

        return (
            <div className="channel-rules-settings" style={{padding: '20px', border: '1px solid #ddd', borderRadius: '5px'}}>
                <div style={{marginBottom: '20px'}}>
                    <p style={{color: '#666', fontSize: '14px'}}>{helpText}</p>
                </div>

                {error && (
                    <div style={{
                        padding: '10px',
                        marginBottom: '15px',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        borderRadius: '4px',
                        border: '1px solid #f5c6cb'
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        padding: '10px',
                        marginBottom: '15px',
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        borderRadius: '4px',
                        border: '1px solid #c3e6cb'
                    }}>
                        {success}
                    </div>
                )}

                <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px'}}>
                    <h4 style={{marginTop: '0'}}>Add New Rule</h4>
                    <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                        <input
                            type="text"
                            placeholder="Channel ID"
                            value={newChannelId}
                            onChange={(e) => this.setState({newChannelId: e.target.value, error: '', success: ''})}
                            style={{
                                flex: 1,
                                padding: '8px',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="User ID"
                            value={newUserId}
                            onChange={(e) => this.setState({newUserId: e.target.value, error: '', success: ''})}
                            style={{
                                flex: 1,
                                padding: '8px',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        />
                        <button
                            onClick={this.handleAddRule}
                            style={{
                                padding: '8px 20px',
                                backgroundColor: '#0058cc',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Add User
                        </button>
                    </div>
                    <p style={{margin: '5px 0 0 0', fontSize: '12px', color: '#666'}}>
                        Tip: You can find Channel ID in Channel Info menu, and User ID in user profile URL
                    </p>
                </div>

                <div>
                    <h4>Current Rules ({Object.keys(rules).length} channels restricted)</h4>
                    {Object.keys(rules).length === 0 ? (
                        <p style={{color: '#666', fontStyle: 'italic'}}>No restrictions configured. All channels are open to all users.</p>
                    ) : (
                        <div>
                            {Object.entries(rules).map(([channelId, userIds]) => (
                                <div
                                    key={channelId}
                                    style={{
                                        marginBottom: '15px',
                                        padding: '15px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        backgroundColor: 'white'
                                    }}
                                >
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                                        <strong style={{fontSize: '14px'}}>Channel: {channelId}</strong>
                                        <button
                                            onClick={() => this.handleRemoveChannel(channelId)}
                                            style={{
                                                padding: '4px 12px',
                                                backgroundColor: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Remove Channel
                                        </button>
                                    </div>
                                    <div>
                                        <p style={{margin: '5px 0', fontSize: '13px', color: '#666'}}>
                                            Whitelisted users ({userIds.length}):
                                        </p>
                                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                                            {userIds.map((userId) => (
                                                <div
                                                    key={userId}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        padding: '5px 10px',
                                                        backgroundColor: '#e9ecef',
                                                        borderRadius: '15px',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    <span style={{marginRight: '8px'}}>{userId}</span>
                                                    <button
                                                        onClick={() => this.handleRemoveUser(channelId, userId)}
                                                        style={{
                                                            padding: '2px 6px',
                                                            backgroundColor: '#6c757d',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '3px',
                                                            cursor: 'pointer',
                                                            fontSize: '10px'
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{marginTop: '20px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px', border: '1px solid #ffc107'}}>
                    <p style={{margin: 0, fontSize: '13px', color: '#856404'}}>
                        <strong>Note:</strong> Changes are saved automatically. Users not in the whitelist will be unable to post in restricted channels.
                    </p>
                </div>
            </div>
        );
    }
}
