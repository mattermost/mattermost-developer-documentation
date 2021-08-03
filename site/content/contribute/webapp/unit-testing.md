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

1. Match snapshot using default or expected props. Note that while the snapshot is convenient, we require not to rely solely on this for every test case as this is easily overlooked by initiating `jest -updateSnapshot` without carefully inspecting the change.
    ```javascript
    const baseProps = {
        active        onSubmit: jest.fn(),
        update    };

    test('should match snapshot, not send email notifications', () => {
        const wrapper = shallow(<EmailNotificationSetting {...baseProps}/>);

        // Use "toMatchInlineSnapshot" whenever possible when the snapshot consists of several lines of code only
        // It creates an easier to read snapshot, inline with the test file.
        expect(wrapper).toMatchInlineSnapshot();

        // Save snapshot particularly when component has other render function like "renderOption"
        // It creates a small snapshot of that particular render function instead of the entire component
        expect(wrapper.instance().renderOption()).toMatchInlineSnapshot();

        // Only use "toMatchSnapshot" whenever above options are not possible.
        // Limit the use to one (1) snapshot only.
        // Save snapshot if it generates an easy to inspect and identifiable HTML or components that can easily verify future change.
        expect(wrapper).toMatchSnapshot();
    });
    ```

2. Add verification to important elements.
    ```javascript
    expect(wrapper.find('#emailNotificationImmediately').exists()).toBe(true);
    expect(wrapper.find('h1').text()).toEqual(props.siteName);
    expect(wrapper.find('h4').text()).toEqual(props.customDescriptionText);
    ```

3. Check CSS class.
    ```javascript
    expect(wrapper.find('#create_post').hasClass('center')).toBe(true);
    ```

4. Simulate the event and verify state changes accordingly.
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
    test('should call updateSection on handleExpand', () => {
        const newUpdateSection = jest.fn();
        const wrapper = mountWithIntl(
            <EmailNotificationSetting
                {...baseProps}
                updateSection={newUpdateSection}
            />
        );
        wrapper.instance().handleExpand();

        expect(newUpdateSection).toBeCalled();
        expect(newUpdateSection).toHaveBeenCalledTimes(1);
        expect(newUpdateSection).toBeCalledWith('email');
    });
    ```

6. When a function is passed to a component via props, make sure to test if it gets called for a particular event call or its state changes.
    ```javascript
    test('should call functions on handleSubmit', () => {
        const newOnSubmit = jest.fn();
        const newUpdateSection = jest.fn();
        const wrapper = mountWithIntl(
            <EmailNotificationSetting
                {...baseProps}
                onSubmit={newOnSubmit}
                updateSection={newUpdateSection}
            />
        );

        wrapper.instance().handleSubmit();

        expect(newOnSubmit).not.toBeCalled();
        expect(newUpdateSection).toHaveBeenCalledTimes(1);
        expect(newUpdateSection).toBeCalledWith('');

        wrapper.find('#emailNotificationNever').simulate('change');
        wrapper.instance().handleSubmit();

        expect(newOnSubmit).toBeCalled();
        expect(newOnSubmit).toHaveBeenCalledTimes(1);
        expect(newOnSubmit).toBeCalledWith({enableEmail: 'false'});

        expect(savePreference).toHaveBeenCalledTimes(1);
        expect(savePreference).toBeCalledWith('notifications', 'email_interval', '0');
    });
    ```

7. Test the component's internal or lifecycle methods by having different sets of props.
    ```javascript
    test('should pass componentWillReceiveProps', () => {
        const nextProps = {
            enableEmail: true,
            emailInterval: 30
        };
        const wrapper = mountWithIntl(<EmailNotificationSetting {...baseProps}/>);
        wrapper.setProps(nextProps);

        expect(wrapper.state('enableEmail')).toBe(nextProps.enableEmail);
        expect(wrapper.state('emailInterval')).toBe(nextProps.emailInterval);

        ...
        const shouldUpdate = wrapper.instance().shouldComponentUpdate({show: true});
        expect(shouldUpdate).toBe(true);
    });
    ```

8. Provide a mockup of a function required by the component but also pass other exported functions out of it to prevent potential error when those were used indirectly by another functions.
    ```javascript
    jest.mock('utils/utils', () => {
        const original = require.requireActual('utils/utils');
        return {
            ...original,
            isMobile: jest.fn(() => true),
        };
    });
    ```

9.  Simply mock the ``mattermost-redux`` action as necessary with readable action type with arguments.
    ```javascript
    jest.mock('mattermost-redux/actions/channels', () => {
        const original = require.requireActual('mattermost-redux/actions/channels');
        return {
            ...original,
            fetchMyChannelsAndMembers: (...args) => ({type: 'MOCK_FETCH_CHANNELS_AND_MEMBERS', args}),
        };
    });

    // then compare the dispatched actions
    await testStore.dispatch(Actions.loadChannelsForCurrentUser());
    expect(testStore.getActions()).toEqual(expectedActions);
    ```

10. For utility functions, list all test cases with test description, input and output.
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

    testCases.forEach((testCase) => it(testCase.description, () => {
        expect(stripMarkdown(testCase.inputText)).toEqual(testCase.outputText);
    }));
    ```


Finally, initiate the following commands:

1. Run `npm run test:watch`, select `p` and type filename, and see if the component test passed.
2. Run `npm run test:coverage`, and open the corresponding html report at `coverage/components` folder to see the percentage covered. Update the test if necessary. Note that it's not required to meet 100% coverage of a component especially if it will require an unnecessary or complicated mock up. Uncovered lines, statements, branches or functions will just be recorded so that it will be covered by next test layers like integrations or end-to-end testing.


## Troubleshooting

### 1. Getting "UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'filter' of undefined"
a. Check whether the file being tested used native timer functions (i.e., setTimeout, setInterval, clearTimeout, clearInterval).  You may mock the timers and/or run fake timers (e.g. ``jest.useFakeTimers()``) if necessary.  Note that ``jest.useFakeTimers()`` is already in the Jest [global setup](https://github.com/mattermost/mattermost-webapp/blob/master/tests/setup.js) but there are cases where it needs to run specifically depending on how the component uses the native timer functions.

### 2. Getting "UnhandledPromiseRejectionWarning: TypeError: (0 , _fff.hhh) is not a function"
a. Mock the specific function being used by the component but also passed other exported functions of it.

- On the test file: It should be mocked like:

    ```javascript
    // DO NOT partially mock the module
    jest.mock('actions/storage', () => ({
        setGlobalItem: (...args) => ({type: 'MOCK_SET_GLOBAL_ITEM', args}),
    }));

    // DO fully mock the module.  Observed the inclusion on "...original" in the return value.
    jest.mock('actions/storage', () => {
        const original = require.requireActual('actions/storage');
        return {
            ...original,
            setGlobalItem: (...args) => ({type: 'MOCK_SET_GLOBAL_ITEM', args}),
        };
    });
    ```

### 3. Getting "UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'data' of undefined"
a. Use async mock function with resolved value. "Cannot read property" can be ``error``, ``data``, ``exists``, ``match``, or whatever the resolve value that the function returns.

- On the file being tested: If the function returns a value, like below it returns it waits for the return value of ``data``.

    ```javascript
    const {data} = await this.props.actions.addUsersToTeam(this.props.currentTeamId, userIds);
    ```

- On the test file: It should be mocked like:

    ```javascript
    // DO NOT assign a regular mock function.
    const addUsersToTeam = jest.fn();

    // DO NOT mock async function with undefined resolved value.
    const addUsersToTeam: jest.fn(() => {
        return new Promise((resolve) => {
            process.nextTick(() => resolve());
        });
    }),

    // DO mock async function with resolved value.  Observed the used of "mockResolvedValue".
    const addUsersToTeam = jest.fn().mockResolvedValue({data: true})

    // DO mock async function with several resolved values for different test cases.
    const addUsersToTeam = jest.fn().
        mockResolvedValueOnce({error: true}).
        mockResolvedValue({data: true});
    ```

b. Use async test callback for async function instance

- On the file being tested: If the instance function is async.

    ```javascript
    handleSubmit = async (e) => {
        ...
        const {data} = await this.props.actions.addUsersToTeam(this.props.currentTeamId, userIds);
        ...
    }
    ```

- On the test file: Instance function should be tested like:

    ```javascript
    // DO NOT test as regular function.
    test('should match state when handleSubmit is called', () => {
        wrapper.instance().handleSubmit();
        expect(...)
    }

    // DO test as async function.  Observed the async test callback and await on instance function.
    test('should match state when handleSubmit is called', async () => {
        await wrapper.instance().handleSubmit();
        expect(addUsersToTeam).toHaveBeenCalledTimes(1);
    }
    ```
