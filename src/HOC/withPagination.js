import React, { Component } from "react";
import PropTypes from "prop-types";
import { decodeGetParams, encodeGetParams } from "../global/functions";

export const withPagination = options => (
  WrappedComponent,
  PaginationComponent
) =>
  class WithPaginationHOC extends Component {
    static propTypes = {
      fetchData: PropTypes.func.isRequired,
      location: PropTypes.object.isRequired,
      pathname: PropTypes.string,
      search: PropTypes.string
    };

    // -----------------Methods-------------------

    paginate = async params => {
      const { fetchData } = this.props;
      const search = encodeGetParams(params);

      this.setState({ params, isLoading: true });
      const { data, count } = await fetchData(search);
      this.setState({ data, count, isLoading: false });
    };

    parseURLParamsAndAddPage = () => {
      const { location } = this.props;
      const params = decodeGetParams(location.search);

      return { ...params, page: params.page ? Number(params.page) : 1 };
    };

    // ----------------Lifecycle------------------

    componentDidMount = () => {
      const newParams = this.parseURLParamsAndAddPage();
      this.paginate(newParams);
    };

    componentDidUpdate = () => {
      const { params: prevParams } = this.state;
      const newParams = this.parseURLParamsAndAddPage();
      const pageHasChanged = prevParams.page !== newParams.page;

      if (pageHasChanged) this.paginate(newParams);
    };

    // -------------------------------------------

    state = {
      data: [],
      params: {
        page: 1
      },
      count: 1,
      isLoading: true
    };

    render = () => (
      <>
        <PaginationComponent {...this.props} {...this.state} />
        <WrappedComponent {...this.props} {...this.state} />
        <PaginationComponent {...this.props} {...this.state} />
      </>
    );
  };
