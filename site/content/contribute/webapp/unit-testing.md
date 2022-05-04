---
title: "Unit Testing"
heading: "Unit Testing at Mattermost"
description: "Review our guidelines for unit testing for your Mattermost webapp, including a guide on how to do component testing."
date: 2018-11-20T11:35:32-04:00
weight: 5
---

## Component and Utility files

The last required piece of building a webapp component is to test it. That can be done using the component testing framework described in this blog post: https://grundleborg.github.io/posts/react-component-testing-in-mattermost/.

[Jest](https://jestjs.io/en/) and [Enzyme](https://airbnb.io/enzyme/) are the main framework and testing utilities used in testing components and utility files of ``mattermost-webapp``.  Please visit their respective documentation for detailed information on how to get started, best practices and updates.

Below is a brief guide on how to do component testing:

1. Match snapshot using default or expected props. Note that while the snapshot is convenient, we shouldn't rely solely on this for every test case as changes can be easily overlooked when using `jest -updateSnapshot` to update multiple snapshots at once.
    ```javascript
    const baseProps = {
        active: true,
        onSubmit: jest.fn(),
    };

    test('should match snapshot, not send email notifications', () => {
        const wrapper = shallow(<EmailNotificationSetting {...baseProps}/>);

        expect(wrapper).toMatchSnapshot();

        // Save a snapshot of part of a component when it has another render function like "renderOption".
        // This creates a small snapshot of that particular render function's result instead of the entire component.
        expect(wrapper.instance().renderOption()).toMatchSnapshot();
    });
    ```

2. Add verification of important elements.
    ```javascript
    expect(wrapper.find('#emailNotificationImmediately').exists()).toBe(true);
    expect(wrapper.find('h1').text()).toEqual(props.siteName);
    expect(wrapper.find('h4').text()).toEqual(props.customDescriptionText);
    ```

3. Check CSS classes.
    ```javascript
    expect(wrapper.find('#create_post').hasClass('center')).toBe(true);
    ```

4. Simulate an event and verify state changes accordingly.
    ```javascript
    test('should pass handleChange', () => {
        const wrapper = mountWithIntl(<EmailNotificationSetting {...baseProps}/>);
        wrapper.find('#emailNotificationImmediately').simulate('change');

        expect(wrapper.state('enableEmail')).toBe('true');
        expect(wrapper.state('emailInterval')).toBe(30);
    });
    ```

5. Ensure that all functions of a component are tested. This can be done via events, state changes or just calling it directly.
    ```javascript
    const baseProps = {
        updateSection: jest.fn(),
    };

    test('should call updateSection on handleExpand', () => {
        // Jest mocks are automatically cleared between tests, so they don't need to be redefined.
        const wrapper = mountWithIntl(<EmailNotificationSetting {...baseProps}/>);

        wrapper.instance().handleExpand();

        expect(baseProps.updateSection).toBeCalled();
        expect(baseProps.updateSection).toHaveBeenCalledTimes(1);
        expect(baseProps.updateSection).toBeCalledWith('email');
    });
    ```

6. When a function is passed to a component via props, make sure to test if it gets called for a particular event call or its state changes.
    ```javascript
    const baseProps = {
        onSubmit: jest.fn(),
        updateSection: jest.fn(),
    };

    test('should call functions on handleSubmit', () => {
        const wrapper = mountWithIntl(<EmailNotificationSetting {...baseProps}/>);

        wrapper.instance().handleSubmit();

        expect(baseProps.onSubmit).not.toBeCalled();
        expect(baseProps.updateSection).toHaveBeenCalledTimes(1);
        expect(baseProps.updateSection).toBeCalledWith('');

        wrapper.find('#emailNotificationNever').simulate('change');
        wrapper.instance().handleSubmit();

        expect(baseProps.onSubmit).toBeCalled();
        expect(baseProps.onSubmit).toHaveBeenCalledTimes(1);
        expect(baseProps.onSubmit).toBeCalledWith({enableEmail: 'false'});

        expect(baseProps.updateSection).toHaveBeenCalledTimes(2);
        expect(baseProps.updateSection).toBeCalledWith('');
    });
    ```

7. Provide a mock for a single function imported from another file while keeping the original version of the rest of that file's exports.
    ```javascript
    jest.mock('utils/utils', () => {
        const original = require.requireActual('utils/utils');
        return {
            ...original,
            isMobileView: jest.fn(() => true),
        };
    });
    ```

8.  Mock async ``redux`` actions as necessary while providing a readable action type and having them pass their arguments.
    ```javascript
    jest.mock('mattermost-redux/actions/channels', () => {
        const original = require.requireActual('mattermost-redux/actions/channels');
        return {
            ...original,
            fetchMyChannelsAndMembers: (...args) => ({type: 'MOCK_FETCH_CHANNELS_AND_MEMBERS', args}),
        };
    });

    // Then compare the dispatched actions
    await testStore.dispatch(Actions.loadChannelsForCurrentUser());
    expect(testStore.getActions()).toEqual(expectedActions);
    ```

9. For utility functions, list all test cases with test description, input and output.
    ```javascript
    describe('stripMarkdown | RemoveMarkdown', () => {
        const testCases = [{
            description: 'emoji: same',
            inputText: 'Hey :smile: :+1: :)',
            outputText: 'Hey :smile: :+1: :)',
        },
        {
            description: 'at-mention: same',
            inputText: 'Hey @user and @test',
            outputText: 'Hey @user and @test',
        }];

        testCases.forEach((testCase) => {
            test(testCase.description, () => {
                expect(stripMarkdown(testCase.inputText)).toEqual(testCase.outputText);
            });
        });
    }
    ```

Finally, initiate the following commands:

1. Run `npm run test:watch`, select `p` and type filename, and see if the component test passed.
2. Run `npm run test:coverage` and open the corresponding html report at `coverage/components` folder to see the percentage covered. Update the test if necessary. Note that it's not required to meet 100% coverage of a component, especially if it will require unnecessary or complicated mocking. Uncovered lines, statements, branches or functions will just be recorded so that it will be covered by other tests like integration or end-to-end testing.

## Troubleshooting

### 1. If you get an error like "UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'filter' of undefined"
a. Check if the code being tested used native timer functions (i.e., setTimeout, setInterval, clearTimeout, clearInterval). You can mock the timers and/or run fake timers (e.g. `jest.useFakeTimers()`) if necessary. Note that `jest.useFakeTimers()` is already in the Jest [global setup](https://github.com/mattermost/mattermost-webapp/blob/master/tests/setup.js), but there are cases where it needs to run specifically depending on how the component uses the native timer functions.

### 2. If you get an error like "UnhandledPromiseRejectionWarning: TypeError: (0 , \_fff.hhh) is not a function"
a. Check if you're mocking part of an imported module without providing other exports which are used. You can use `require.requireActual` to get the unmocked version of the file.

    ```javascript
    // DO NOT partially mock the module
    jest.mock('actions/storage', () => ({
        setGlobalItem: (...args) => ({type: 'MOCK_SET_GLOBAL_ITEM', args}),
    }));

    // DO fully mock the module
    jest.mock('actions/storage', () => {
        const original = require.requireActual('actions/storage');
        return {
            ...original,
            setGlobalItem: (...args) => ({type: 'MOCK_SET_GLOBAL_ITEM', args}),
        };
    });
    ```

### 3. If you get an error like "UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'data' of undefined"
a. Use async mock functions with resolved value. The property that cannot be readcan be `error`, `data`, `exists`, `match`, or whatever the resolved value contains.

If the file being tested contains a line where it awaits on an async value like

    ```javascript
    const {data} = await this.props.actions.addUsersToTeam(this.props.currentTeamId, userIds);
    ```
the mocked function should return a Promise by using `mockResolvedValue`.

    ```javascript
    // DO NOT assign a regular mock function.
    const addUsersToTeam = jest.fn();

    // DO NOT forget to provide a resolved value.
    const addUsersToTeam: jest.fn(() => {
        return new Promise((resolve) => {
            process.nextTick(() => resolve());
        });
    }),

    // DO mock async function with resolved value. `mockResolvedValue` is the easiest way to do this.
    const addUsersToTeam = jest.fn().mockResolvedValue({data: true})

    // DO mock async function with several resolved values for repeated calls.
    const addUsersToTeam = jest.fn().
        mockResolvedValueOnce({error: true}).
        mockResolvedValue({data: true});
    ```
    
Remember to make individual test cases async when testing async functions.

    ```javascript
    // DO NOT forget to wait for the async function to complete.
    test('should match state when handleSubmit is called', () => {
        wrapper.instance().handleSubmit();
        expect(...)
    });

    // DO remember to await on the async function and to make the entire test case async.
    test('should match state when handleSubmit is called', async () => {
        await wrapper.instance().handleSubmit();
        expect(addUsersToTeam).toHaveBeenCalledTimes(1);
    });
    ```
